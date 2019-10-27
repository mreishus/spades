defmodule SpadesGame.GameServer do
  @moduledoc """
  Genserver to hold a %Game{}'s state within a process.
  """

  use GenServer
  require Logger
  @timeout :timer.hours(1)

  alias SpadesGame.{Card, Game, GameOptions}

  #####################################
  ########### PUBLIC API ##############
  #####################################

  @doc """
  start_link/1: Generates a new game server under a provided name.
  """
  # Using type specs in genserver causes my app to not compile..??
  # @spec start_link(t.String) :: {:ok, pid} | {:error, any}
  def start_link(game_name) do
    GenServer.start_link(__MODULE__, {game_name}, name: via_tuple(game_name))
  end

  @doc """
  start_link/2: Generates a new game server under a provided name with specified options.
  """
  def start_link(game_name, %GameOptions{} = game_options) do
    GenServer.start_link(__MODULE__, {game_name, game_options}, name: via_tuple(game_name))
  end

  @doc """
  via_tuple/1: Given a game name string, generate a via tuple for addressing the game.
  """
  def via_tuple(game_name),
    do: {:via, Registry, {SpadesGame.GameRegistry, {__MODULE__, game_name}}}

  @doc """
  game_pid/1: Returns the `pid` of the game server process registered
  under the given `game_name`, or `nil` if no process is registered.
  """
  def game_pid(game_name) do
    game_name
    |> via_tuple()
    |> GenServer.whereis()
  end

  @doc """
  state/1:  Retrieves the game state for the game under a provided name.
  """
  # @spec state(t.String) :: %Game{}
  def state(game_name) do
    case game_pid(game_name) do
      nil -> nil
      _ -> GenServer.call(via_tuple(game_name), :state)
    end
  end

  @doc """
  discard/1: Move a card from the draw pile to the discard pile.
  """
  @spec discard(String.t()) :: Game.t()
  def discard(game_name) do
    GenServer.call(via_tuple(game_name), :discard)
  end

  @doc """
  Bid/3: Place a bid.
  """
  @spec bid(String.t(), :west | :north | :east | :south, integer) ::
          {:ok, Game.t()} | {:error, String.t()}
  def bid(game_name, seat, bid_amount) do
    GenServer.call(via_tuple(game_name), {:bid, seat, bid_amount})
  end

  @doc """
  play/3: Play a card.
  """
  @spec play(String.t(), :west | :north | :east | :south, Card.t()) ::
          {:ok, Game.t()} | {:error, String.t()}
  def play(game_name, seat, %Card{} = card) do
    GenServer.call(via_tuple(game_name), {:play, seat, card})
  end

  #####################################
  ########### IMPLEMENTATION ##########
  #####################################

  @impl GenServer
  def init({game_name}) do
    Logger.info("GameServer: Starting a server for game named [#{game_name}].")
    _init(game_name, Game.new(game_name))
  end

  @impl GenServer
  def init({game_name, %GameOptions{} = game_options}) do
    Logger.info("GameServer: Starting a server for game named [#{game_name}].")
    _init(game_name, Game.new(game_name, game_options))
  end

  defp _init(game_name, new_game) do
    game =
      case :ets.lookup(:games, game_name) do
        [] ->
          game = new_game
          :ets.insert(:games, {game_name, game})
          game

        [{^game_name, game}] ->
          game
      end

    {:ok, game, @timeout}
  end

  @impl GenServer
  def handle_call({:bid, seat, bid_num}, _from, game) do
    case Game.bid(game, seat, bid_num) do
      {:ok, new_game} ->
        :ets.insert(:games, {game.game_name, new_game})
        {:reply, {:ok, new_game}, new_game, @timeout}

      {:error, msg} ->
        {:reply, {:error, msg}, game, @timeout}
    end
  end

  @impl GenServer
  def handle_call({:play, seat, card}, _from, game) do
    case Game.play(game, seat, card) do
      {:ok, new_game} ->
        :ets.insert(:games, {game.game_name, new_game})
        {:reply, {:ok, new_game}, new_game, @timeout}

      {:error, msg} ->
        {:reply, {:error, msg}, game, @timeout}
    end
  end

  @impl GenServer
  def handle_call(:state, _from, game) do
    {:reply, game, game, @timeout}
  end

  @impl GenServer
  def handle_call(:discard, _from, game) do
    new_game = Game.discard(game)
    :ets.insert(:games, {game.game_name, new_game})
    {:reply, new_game, new_game, @timeout}
  end

  # When timing out, the order is handle_info(:timeout, _) -> terminate({:shutdown, :timeout}, _)
  @impl GenServer
  def handle_info(:timeout, game) do
    {:stop, {:shutdown, :timeout}, game}
  end

  @impl GenServer
  def terminate({:shutdown, :timeout}, game) do
    Logger.info("GameServer: Terminate (Timeout) running for #{game.game_name}")
    :ets.delete(:games, game.game_name)
    :ok
  end

  @impl GenServer
  def terminate(_reason, game) do
    Logger.info("GameServer: Strange termination for [#{game.game_name}].")
    :ok
  end
end
