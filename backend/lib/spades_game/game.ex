defmodule SpadesGame.Game do
  @moduledoc """
  Represents a game of spades.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  Right now, it's a simple draw pile and a discard pile.
  """
  alias SpadesGame.{Deck, Game, GamePlayer, GameOptions}

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
    :south
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
          south: GamePlayer.t()
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
      south: s
    }
  end

  ## Given GameOptions, return an array of
  ## 4 hands to use when constructing the game.
  defp get_initial_hands(options) do
    case options.hardcoded_cards do
      true ->
        Deck.hardcoded_cards()

      _ ->
        Deck.new_shuffled() |> Enum.chunk_every(13)
    end
  end

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
