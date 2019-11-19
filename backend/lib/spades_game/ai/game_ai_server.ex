defmodule SpadesGame.GameAIServer do
  @moduledoc """
  ..
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
    gameai = %{game_name: game_name}
    {:ok, gameai, @timeout}
  end

  def handle_call(:state, _from, state) do
    {:reply, state, state, @timeout}
  end

  def handle_info(:tick, %{game_name: game_name} = state) do
    # "GameAI Server: TICK!"
    # |> IO.inspect()

    game_ui = GameUIServer.state(game_name)

    cond do
      GameAI.waiting_bot_bid?(game_ui) ->
        bid_amount = GameAI.bid_amount(game_ui)
        GameUIServer.bid(game_name, :bot, bid_amount)
        GameUIServer.bot_notify(game_name)

      GameAI.waiting_bot_play?(game_ui) ->
        card = GameAI.play_card(game_ui)
        GameUIServer.play(game_name, :bot, card)
        GameUIServer.bot_notify(game_name)

      true ->
        nil
    end

    {:noreply, state}
  end
end
