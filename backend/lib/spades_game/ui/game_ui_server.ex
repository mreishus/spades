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
  @spec state(String.t()) :: GameUI.t() | nil
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
  @spec discard(String.t()) :: GameUI.t()
  def discard(game_name) do
    GenServer.call(via_tuple(game_name), :discard)
  end

  @doc """
  bid/3: A player just submitted a bid.
  """
  @spec bid(String.t(), integer, integer) :: GameUI.t()
  def bid(game_name, user_id, bid_amount) do
    GenServer.call(via_tuple(game_name), {:bid, user_id, bid_amount})
  end

  @doc """
  rewind_countdown_devtest/1: Make the "game start" countdown happen
  instantly.
  Works by moving back the "everyone sat down" timestamp by 10 minutes.
  Should be used in dev+test only.
  """
  def rewind_countdown_devtest(game_name) do
    GenServer.call(via_tuple(game_name), :rewind_countdown_devtest)
  end

  @doc """
  sit/3: User is asking to sit in one of the seats.
  which_seat is "north", "west", "east" or "south".
  """
  @spec sit(String.t(), integer, String.t()) :: GameUI.t()
  def sit(game_name, user_id, which_seat) do
    GenServer.call(via_tuple(game_name), {:sit, user_id, which_seat})
  end

  @doc """
  leave/2: User just leave the room (Closed browser or clicked out).
  If they're in a seat, we need to mark them as gone.
  Maybe eventually there will be some sophisticated disconnect/reconnect
  system?
  """
  def leave(game_name, user_id) do
    GenServer.call(via_tuple(game_name), {:leave, user_id})
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
    GameUI.checks(state)
    |> save_and_reply()
  end

  def handle_call(:discard, _from, state) do
    GameUI.discard(state)
    |> save_and_reply()
  end

  def handle_call(:rewind_countdown_devtest, _from, state) do
    GameUI.rewind_countdown_devtest(state)
    |> save_and_reply()
  end

  def handle_call({:bid, user_id, bid_amount}, _from, gameui) do
    GameUI.bid(gameui, user_id, bid_amount)
    |> save_and_reply()
  end

  def handle_call({:sit, user_id, which_seat}, _from, gameui) do
    new_gameui = GameUI.sit(gameui, user_id, which_seat)

    if new_gameui.when_seats_full != nil do
      push_state_to_clients_for_12_seconds()
    end

    save_and_reply(new_gameui)
  end

  def handle_call({:leave, user_id}, _from, gameui) do
    GameUI.leave(gameui, user_id)
    |> save_and_reply()
  end

  defp save_and_reply(new_gameui) do
    :ets.insert(:game_uis, {new_gameui.game_name, new_gameui})
    {:reply, new_gameui, new_gameui, timeout(new_gameui)}
  end

  # This is to handle the "Game Start" countdown.
  # 10 seconds after everyone sits down, the game begins.
  # We will spawn a process that calls ":state" every second
  # and pushes that state down to the clients, so they will see
  # the game status move to playing after 10 seconds.
  defp push_state_to_clients_for_12_seconds() do
    pid = self()

    spawn_link(fn ->
      1..12
      |> Enum.each(fn _ ->
        Process.sleep(1000)
        state = GenServer.call(pid, :state)
        SpadesWeb.RoomChannel.notify_from_outside(state.game_name)
      end)
    end)
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
