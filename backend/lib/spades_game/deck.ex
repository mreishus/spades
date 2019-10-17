defmodule SpadesGame.Deck do
  @moduledoc """
  Represents a list of playing cards.
  """
  alias SpadesGame.{Deck, Card}

  @type t :: [Card.t()]

  @spec new_shuffled() :: Deck.t()
  @doc """
  new_shuffled/0: Returns a new deck with 52 cards, shuffled.
  """
  def new_shuffled do
    for rank <- Card.ranks(), suit <- Card.suits() do
      %Card{rank: rank, suit: suit}
    end
    |> Enum.shuffle()
  end

  @doc """
  new_empty/0: Makes an empty deck.
  Could be used for an empty pile, like an empty discard pile.
  """
  @spec new_empty() :: Deck.t()
  def new_empty do
    []
  end

  @doc """
  shuffle/1: Returns the input deck with its cards shuffled.
  """
  @spec shuffle(Deck.t()) :: Deck.t()
  def shuffle(deck) do
    Enum.shuffle(deck)
  end
end
