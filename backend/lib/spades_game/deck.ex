defmodule SpadesGame.Deck do
  @moduledoc """
  Represents a list of playing cards.
  """
  alias SpadesGame.{Deck, Card}

  @type t :: [Card.t()]


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

  @doc """
  sort/1: basic sort for console display
  """
  @spec sort(Deck.t()) :: Deck.t()
  def sort(deck) do
    deck
  end

  @spec hardcoded_cards() :: list(Deck.t())
  def hardcoded_cards do
    []
  end
end
