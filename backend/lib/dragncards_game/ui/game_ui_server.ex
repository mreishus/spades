defmodule DragnCardsGame.GameUIServer do
  @moduledoc """
  GenServer for holding GameUI state.
  """
  use GenServer
  @timeout :timer.minutes(60)

  require Logger
  alias DragnCardsGame.{Game, Card, GameOptions, GameUI, GameRegistry, Groups, User, Stack, Tokens}

  def is_player(gameui, user_id) do
    ids = gameui["playerIds"]
    if Enum.member?([ids["player1"], ids["player2"], ids["player3"], ids["player4"]], user_id) do
        true
    else
        false
    end
  end

  @doc """
  start_link/3: Generates a new game server under a provided name.
  """
  @spec start_link(String.t(), User.t(), %GameOptions{}) :: {:ok, pid} | {:error, any}
  def start_link(gameName, user, %GameOptions{} = options) do
    IO.puts("gameuiserver: start_link a")
    GenServer.start_link(__MODULE__, {gameName, user, options}, name: via_tuple(gameName))
    IO.puts("gameuiserver: start_link b")
  end

  @doc """
  via_tuple/1: Given a game name string, generate a via tuple for addressing the game.
  """
  def via_tuple(gameName),
    do: {:via, Registry, {DragnCardsGame.GameUIRegistry, {__MODULE__, gameName}}}

  @doc """
  gameui_pid/1: Returns the `pid` of the game server process registered
  under the given `gameName`, or `nil` if no process is registered.
  """
  def gameui_pid(gameName) do
    gameName
    |> via_tuple()
    |> GenServer.whereis()
  end

  @doc """
  state/1:  Retrieves the game state for the game under a provided name.
  """
  @spec state(String.t()) :: GameUI.t() | nil
  def state(gameName) do
    IO.puts("game_ui_server state")
    # IO.inspect(GenServer.call(via_tuple(gameName), :state))
    case gameui_pid(gameName) do
      nil -> nil
      _ -> GenServer.call(via_tuple(gameName), :state)
    end
  end

  @spec game_exists?(String.t()) :: boolean
  def game_exists?(gameName) do
    gameui_pid(gameName) != nil
  end

  @doc """
  game_action/4: Perform given action on a card.
  """
  @spec game_action(String.t(), integer, String.t(), Map.t()) :: GameUI.t()
  def game_action(gameName, user_id, action, options) do
    IO.puts("game_ui_server: game_action")
    GenServer.call(via_tuple(gameName), {:game_action, user_id, action, options})
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

  def init({gameName, user, options = %GameOptions{}}) do
    IO.puts("game_ui_server init a")
    gameui =
      case :ets.lookup(:game_uis, gameName) do
        [] ->
          IO.puts("case 1")
          IO.inspect(user)
          gameui = GameUI.new(gameName, user, options)
          :ets.insert(:game_uis, {gameName, gameui})
          gameui

        [{^gameName, gameui}] ->
          IO.puts("case 2")
          gameui
      end

    IO.puts("game_ui_server init b")
    GameRegistry.add(gameui["gameName"], gameui)
    {:ok, gameui, timeout(gameui)}
  end

  def handle_call(:state, _from, state) do
    reply(state)
  end

  def handle_call({:game_action, user_id, action, options}, _from, gameui) do
    try do
      gameui = GameUI.game_action(gameui, user_id, action, options)
      put_in(gameui["error"], false)
    rescue
      e in RuntimeError ->
        IO.inspect(e)
        put_in(gameui["error"],true)
    end
    |> save_and_reply()
  end

  defp reply(new_gameui) do
    {:reply, new_gameui, new_gameui, timeout(new_gameui)}
  end

  defp save_and_reply(new_gameui) do
    # Async GameRegistry.update Should improve performance,
    # but causes tests to fail.  Not sure it's a real failure
    # spawn_link(fn ->

    GameRegistry.update(new_gameui["gameName"], new_gameui)
    # end)

    spawn_link(fn ->
      :ets.insert(:game_uis, {new_gameui["gameName"], new_gameui})
    end)

    {:reply, new_gameui, new_gameui, timeout(new_gameui)}
  end

  # timeout/1
  # Given the current state of the game, what should the
  # GenServer timeout be? (Games with winners expire quickly)
  defp timeout(_state) do
    @timeout
  end

  def handle_call({:leave, user_id}, _from, gameui) do
    # When a user leaves, we currently do nothing
    gameui
    |> save_and_reply()
  end

  # When timing out, the order is handle_info(:timeout, _) -> terminate({:shutdown, :timeout}, _)
  def handle_info(:timeout, state) do
    {:stop, {:shutdown, :timeout}, state}
  end

  def terminate({:shutdown, :timeout}, state) do
    Logger.info("Terminate (Timeout) running for #{state["gameName"]}")
    :ets.delete(:game_uis, state["gameName"])
    GameRegistry.remove(state["gameName"])
    :ok
  end

  # Do I need to trap exits here?
  def terminate(_reason, state) do
    Logger.info("Terminate (Non Timeout) running for #{state["gameName"]}")
    GameRegistry.remove(state["gameName"])
    :ok
  end
end
