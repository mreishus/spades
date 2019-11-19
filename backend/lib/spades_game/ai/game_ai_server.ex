defmodule SpadesGame.GameAIServer do
  @moduledoc """
  Server that polls a GameUIServer, looking for bot turns.
  If it's a bot's turn, computes the bot move and sends it to
  the GameUIServer.
  """
  use GenServer
  @timeout :timer.minutes(60)
  alias SpadesGame.{GameAI, GameUIServer}

  require Logger

  @doc """
  start_link/2: Generates a new game server under a provided name.
  """
  @spec start_link(String.t()) :: {:ok, pid} | {:error, any}
  def start_link(game_name) do
    GenServer.start_link(__MODULE__, {game_name}, name: via_tuple(game_name))
  end

  @doc """
  via_tuple/1: Given a game name string, generate a via tuple for addressing the game.
  """
  def via_tuple(game_name),
    do: {:via, Registry, {SpadesGame.GameAIRegistry, {__MODULE__, game_name}}}

  @doc """
  gameui_pid/1: Returns the `pid` of the game server process registered
  under the given `game_name`, or `nil` if no process is registered.
  """
  def gameai_pid(game_name) do
    game_name
    |> via_tuple()
    |> GenServer.whereis()
  end

  @doc """
  state/1:  Retrieves the game state for the game under a provided name.
  """
  # @spec state(String.t()) :: GameUI.t() | nil
  def state(game_name) do
    case gameai_pid(game_name) do
      nil -> nil
      _ -> GenServer.call(via_tuple(game_name), :state)
    end
  end

  #####################################
  ####### IMPLEMENTATION ##############
  #####################################
  def init({game_name}) do
    :timer.send_interval(1000, :tick)
    gameai = %{game_name: game_name, last_action: DateTime.utc_now()}
    {:ok, gameai, @timeout}
  end

  def handle_call(:state, _from, state) do
    {:reply, state, state, @timeout}
  end

  def handle_call(:kill_me_pls, _from, %{game_name: game_name} = state) do
    GameUIServer.bots_leave(game_name)
    {:stop, :normal, state}
  end

  # When ticking, check to see if the game is waiting on a bot move,
  # and if so, perform it
  def handle_info(:tick, %{game_name: game_name} = state) do
    game_ui = GameUIServer.state(game_name)

    new_state =
      cond do
        GameAI.waiting_bot_bid?(game_ui) ->
          bid_amount = GameAI.bid_amount(game_ui)
          GameUIServer.bid(game_name, :bot, bid_amount)
          GameUIServer.bot_notify(game_name)
          update_last_action(state)

        GameAI.waiting_bot_play?(game_ui) ->
          card = GameAI.play_card(game_ui)
          GameUIServer.play(game_name, :bot, card)
          GameUIServer.bot_notify(game_name)
          update_last_action(state)

        true ->
          state
      end

    check_inactivity(new_state)

    {:noreply, new_state}
  end

  # Update the "last_action" timestamp in state to be now
  defp update_last_action(%{} = state) do
    %{state | last_action: DateTime.utc_now()}
  end

  # If a bot hasn't made a move in 15 minutes, kill the bot server
  defp check_inactivity(state) do
    if inactive_too_long(state) do
      pid = self()

      spawn_link(fn ->
        GenServer.call(pid, :kill_me_pls)
      end)
    end
  end

  defp inactive_too_long(%{last_action: last_action} = _state) do
    time_elapsed = DateTime.diff(DateTime.utc_now(), last_action, :millisecond)

    # times in ms
    one_minute = 60 * 1000
    time_elapsed >= 15 * one_minute
    # time_elapsed >= 1 * one_minute
    # time_elapsed >= 20 * 1000
  end
end
