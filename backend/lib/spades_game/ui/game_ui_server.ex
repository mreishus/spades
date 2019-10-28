defmodule SpadesGame.GameUIServer do
  @moduledoc """
  GenServer for holding GameUI state.
  """
  use GenServer
  @timeout :timer.hours(1)

  require Logger
  alias SpadesGame.{GameOptions, GameUI, GameRegistry}

  @doc """
  start_link/2: Generates a new game server under a provided name.
  """
  @spec start_link(String.t(), %GameOptions{}) :: {:ok, pid} | {:error, any}
  def start_link(game_name, %GameOptions{} = options) do
    GenServer.start_link(__MODULE__, {game_name, options}, name: via_tuple(game_name))
  end

  @doc """
  via_tuple/1: Given a game name string, generate a via tuple for addressing the game.
  """
  def via_tuple(game_name),
    do: {:via, Registry, {SpadesGame.GameUIRegistry, {__MODULE__, game_name}}}

  @doc """
  gameui_pid/1: Returns the `pid` of the game server process registered
  under the given `game_name`, or `nil` if no process is registered.
  """
  def gameui_pid(game_name) do
    game_name
    |> via_tuple()
    |> GenServer.whereis()
  end

  @doc """
  state/1:  Retrieves the game state for the game under a provided name.
  """
  @spec state(String.t()) :: %GameUI{} | nil
  def state(game_name) do
    case gameui_pid(game_name) do
      nil -> nil
      _ -> GenServer.call(via_tuple(game_name), :state)
    end
  end

  @doc """
  discard/1: Someone moves a card from the draw pile to the discard pile.
  (Simple state testing.)
  """
  @spec discard(String.t()) :: %GameUI{}
  def discard(game_name) do
    GenServer.call(via_tuple(game_name), :discard)
  end

  @doc """
  sit/3: User is asking to sit in one of the seats.
  which_seat is "north", "west", "east" or "south".
  """
  @spec sit(String.t(), integer, String.t()) :: %GameUI{}
  def sit(game_name, user_id, which_seat) do
    GenServer.call(via_tuple(game_name), {:sit, user_id, which_seat})
  end

  @doc """
  left/2: User just left the room (Closed browser or clicked out).
  If they're in a seat, we need to mark them as gone.
  Maybe eventually there will be some sophisticated disconnect/reconnect
  system?
  """
  def left(game_name, user_id) do
    GenServer.call(via_tuple(game_name), {:left, user_id})
  end

  #####################################
  ####### IMPLEMENTATION ##############
  #####################################

  def init({game_name, options = %GameOptions{}}) do
    gameui =
      case :ets.lookup(:game_uis, game_name) do
        [] ->
          gameui = GameUI.new(game_name, options)
          :ets.insert(:game_uis, {game_name, gameui})
          gameui

        [{^game_name, gameui}] ->
          gameui
      end

    # ? Might add twice if restoring from crash
    GameRegistry.add(gameui.game_name, gameui)
    {:ok, gameui, timeout(gameui)}
  end

  def handle_call(:state, _from, state) do
    new_state = state
    {:reply, new_state, new_state, timeout(new_state)}
  end

  def handle_call(:discard, _from, state) do
    new_state = GameUI.discard(state)
    :ets.insert(:game_uis, {state.game_name, new_state})
    {:reply, new_state, new_state, timeout(new_state)}
  end

  def handle_call({:sit, user_id, which_seat}, _from, gameui) do
    new_gameui = GameUI.sit(gameui, user_id, which_seat)
    :ets.insert(:game_uis, {gameui.game_name, new_gameui})
    {:reply, new_gameui, new_gameui, timeout(new_gameui)}
  end

  def handle_call({:left, user_id}, _from, gameui) do
    new_gameui = GameUI.left(gameui, user_id)
    :ets.insert(:game_uis, {gameui.game_name, new_gameui})
    {:reply, new_gameui, new_gameui, timeout(new_gameui)}
  end

  # In some state updating function:
  # GameRegistry.update(new_gameui.game_name, gameui)
  # :ets.insert(:game_uis, {state.game_name, new_state})

  # timeout/1
  # Given the current state of the game, what should the
  # GenServer timeout be? (Games with winners expire quickly)
  defp timeout(_state) do
    @timeout
  end

  # When timing out, the order is handle_info(:timeout, _) -> terminate({:shutdown, :timeout}, _)
  def handle_info(:timeout, state) do
    {:stop, {:shutdown, :timeout}, state}
  end

  def terminate({:shutdown, :timeout}, state) do
    Logger.info("Terminate (Timeout) running for #{state.game_name}")
    :ets.delete(:game_uis, state.game_name)
    GameRegistry.remove(state.game_name)
    :ok
  end

  # Do I need to trap exits here?
  def terminate(_reason, state) do
    Logger.info("Terminate (Non Timeout) running for #{state.game_name}")
    GameRegistry.remove(state.game_name)
    :ok
  end
end
