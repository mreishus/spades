defmodule SpadesGame.Game do
  @moduledoc """
  Represents a game of spades.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  Right now, it's a simple draw pile and a discard pile.
  """
  alias SpadesGame.{Deck, Game, GamePlayer, GameOptions, Card}

  require Logger

  @derive Jason.Encoder
  defstruct [
    :game_name,
    :options,
    :dealer,
    :status,
    :turn,
    :draw,
    :discard,
    :west,
    :north,
    :east,
    :south,
    :trick
  ]

  @type t :: %Game{
          game_name: String.t(),
          options: GameOptions.t(),
          status: :bidding | :playing,
          dealer: :west | :north | :east | :south,
          turn: :west | :north | :east | :south,
          draw: Deck.t(),
          discard: Deck.t(),
          west: GamePlayer.t(),
          north: GamePlayer.t(),
          east: GamePlayer.t(),
          south: GamePlayer.t(),
          trick: list()
        }

  @doc """
  new/1:  Create a game with default options.
  """
  @spec new(String.t()) :: Game.t()
  def new(game_name) do
    {:ok, options} = GameOptions.validate(%{})
    new(game_name, options)
  end

  @doc """
  new/2:  Create a game with specified options.
  """
  @spec new(String.t(), GameOptions.t()) :: Game.t()
  def new(game_name, %GameOptions{} = options) do
    [w, n, e, s] =
      get_initial_hands(options)
      |> Enum.map(fn d -> GamePlayer.new(d) end)

    %Game{
      game_name: game_name,
      options: options,
      status: :playing,
      dealer: :north,
      turn: :east,
      draw: Deck.new_shuffled(),
      discard: Deck.new_empty(),
      west: w,
      north: n,
      east: e,
      south: s,
      trick: []
    }
  end

  # get_initial_hands/1: (options)
  # return an array of 4 hands to use when constructing the game.
  # uses hardcoded cards if specified by options
  @spec get_initial_hands(GameOptions.t()) :: list(Deck.t())
  defp get_initial_hands(%GameOptions{} = options) do
    case options.hardcoded_cards do
      true ->
        Deck.hardcoded_cards()

      _ ->
        Deck.new_shuffled() |> Enum.chunk_every(13)
    end
  end

  # @spec trick_cards(
  # def trick_cards(game) do
  #   [:west, :north, :east, :south]
  #   |> Enum.map(fn seat -> Map.get(game, seat).trick_card end)
  #   |> Enum.filter(fn card -> card != nil end)
  # end

  @spec play(Game.t(), :west | :north | :east | :south, Card.t()) ::
          {:ok, Game.t()} | {:error, String.t()}

  # Should I add these for pipelining?
  # def play({:ok, game}, seat, card), do: play(game, seat, card)
  # def play({:error, _message}, _seat, _card), do: raise("Can't play on an error tuple")

  def play(%Game{} = game, seat, %Card{} = card) do
    {:ok, game}
    |> ensure_active_player(seat)
    |> remove_card_from_hand(seat, card)
    |> add_card_to_trick(seat, card)
    |> check_for_trick_winner_and_advance_turn()
  end

  @spec ensure_active_player(
          {:ok, Game.t()} | {:error, String.t()},
          :west | :north | :east | :south
        ) ::
          {:ok, Game.t()} | {:error, String.t()}
  def ensure_active_player({:error, message}, _seat), do: {:error, message}

  def ensure_active_player({:ok, game}, seat) do
    if game.turn == seat do
      {:ok, game}
    else
      {:error, "Inactive player attempted to play a card"}
    end
  end

  @spec remove_card_from_hand(
          {:ok, Game.t()} | {:error, String.t()},
          :west | :north | :east | :south,
          Card.t()
        ) ::
          {:ok, Game.t()} | {:error, String.t()}
  def remove_card_from_hand({:error, message}, _seat, _card), do: {:error, message}

  def remove_card_from_hand({:ok, game}, seat, card) do
    player_tuple =
      Map.get(game, seat)
      |> GamePlayer.play(card)

    case player_tuple do
      {:ok, player, _card} ->
        {:ok, Map.put(game, seat, player)}

      {:error, _player} ->
        {:error, "Unable to remove card"}
    end
  end

  @spec add_card_to_trick(
          {:ok, Game.t()} | {:error, String.t()},
          :west | :north | :east | :south,
          Card.t()
        ) ::
          {:ok, Game.t()} | {:error, String.t()}
  def add_card_to_trick({:error, message}, _seat, _card), do: {:error, message}

  def add_card_to_trick({:ok, game}, seat, card) do
    if length(game.trick) >= 4 do
      {:error, "Too many cards in trick to add another"}
    else
      new_trick = [{card, seat} | game.trick]
      {:ok, %Game{game | trick: new_trick}}
    end
  end

  @spec check_for_trick_winner_and_advance_turn({:ok, Game.t()} | {:error, String.t()}) ::
          {:ok, Game.t()} | {:error, String.t()}
  def check_for_trick_winner_and_advance_turn({:error, message}), do: {:error, message}

  def check_for_trick_winner_and_advance_turn({:ok, game}) do
    cond do
      length(game.trick) > 4 ->
        {:error, "Trick too large"}

      length(game.trick) == 4 ->
        {:ok, game}

      length(game.trick) < 4 ->
        game = %Game{game | turn: rotate(game.turn)}
        {:ok, game}
    end
  end

  def rotate(:north), do: :east
  def rotate(:east), do: :south
  def rotate(:south), do: :west
  def rotate(:west), do: :north

  @doc """
  discard/1:  Move one card from the draw pile to the discard pile.
  """
  @spec discard(Game.t()) :: Game.t()
  def discard(%Game{draw: []} = game), do: game

  def discard(%Game{draw: draw, discard: discard}) do
    [top_card | new_draw] = draw
    %Game{draw: new_draw, discard: [top_card | discard]}
  end
end
