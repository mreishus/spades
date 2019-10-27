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

  @spec discard(String.t()) :: %GameUI{}
  def discard(game_name) do
    GenServer.call(via_tuple(game_name), :discard)
  end

  #####################################
  ####### IMPLEMENTATION ##############
  #####################################

  def init({game_name, options = %GameOptions{}}) do
    gameui = GameUI.new(game_name, options)
    GameRegistry.add(gameui.game_name, gameui)
    {:ok, gameui, timeout(gameui)}
  end

  def handle_call(:state, _from, state) do
    new_state = state
    # new_state = ctime(state)
    {:reply, new_state, new_state, timeout(new_state)}
  end

  def handle_call(:discard, _from, state) do
    new_state = GameUI.discard(state)
    {:reply, new_state, new_state, timeout(new_state)}
  end

  # In some state updating function:
  # GameRegistry.update(new_gameui.game_name, gameui)

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
