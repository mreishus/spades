defmodule SpadesGame.Game do
  @moduledoc """
  Represents a game of spades.
  In early stages of the app, it only represents a 
  some toy game used to test everything around it.
  Right now, it's a simple draw pile and a discard pile.
  """
  alias SpadesGame.{Deck, Game}

  defstruct [:draw, :discard]

  @type t :: %Game{
          draw: Deck.t(),
          discard: Deck.t()
        }
  @spec new() :: Game.t()
  def new do
    %Game{
      draw: Deck.new_shuffled(),
      discard: Deck.new_empty()
    }
  end

  @spec discard(Game.t()) :: Game.t()
  @doc """
  discard/1:  Move one card from the draw pile to the discard pile.
  """
  def discard(game = %Game{draw: []}), do: game

  def discard(%Game{draw: draw, discard: discard}) do
    [top_card | new_draw] = draw
    %Game{draw: new_draw, discard: [top_card | discard]}
  end
end
