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

  @spec hardcoded_cards() :: list(Deck.t())
  def hardcoded_cards do
    [
      [
        %Card{rank: 7, suit: :h},
        %Card{rank: 10, suit: :h},
        %Card{rank: 11, suit: :h},
        %Card{rank: 13, suit: :h},
        %Card{rank: 2, suit: :c},
        %Card{rank: 4, suit: :c},
        %Card{rank: 5, suit: :c},
        %Card{rank: 11, suit: :c},
        %Card{rank: 9, suit: :d},
        %Card{rank: 14, suit: :d},
        %Card{rank: 10, suit: :s},
        %Card{rank: 12, suit: :s},
        %Card{rank: 13, suit: :s}
      ],
      [
        %Card{rank: 2, suit: :h},
        %Card{rank: 3, suit: :h},
        %Card{rank: 5, suit: :h},
        %Card{rank: 8, suit: :h},
        %Card{rank: 14, suit: :h},
        %Card{rank: 6, suit: :c},
        %Card{rank: 7, suit: :c},
        %Card{rank: 9, suit: :c},
        %Card{rank: 12, suit: :c},
        %Card{rank: 5, suit: :d},
        %Card{rank: 6, suit: :d},
        %Card{rank: 5, suit: :s},
        %Card{rank: 7, suit: :s}
      ],
      [
        %Card{rank: 6, suit: :h},
        %Card{rank: 12, suit: :h},
        %Card{rank: 8, suit: :c},
        %Card{rank: 14, suit: :c},
        %Card{rank: 3, suit: :d},
        %Card{rank: 4, suit: :d},
        %Card{rank: 7, suit: :d},
        %Card{rank: 10, suit: :d},
        %Card{rank: 12, suit: :d},
        %Card{rank: 13, suit: :d},
        %Card{rank: 2, suit: :s},
        %Card{rank: 3, suit: :s},
        %Card{rank: 9, suit: :s}
      ],
      [
        %Card{rank: 4, suit: :h},
        %Card{rank: 9, suit: :h},
        %Card{rank: 3, suit: :c},
        %Card{rank: 10, suit: :c},
        %Card{rank: 13, suit: :c},
        %Card{rank: 2, suit: :d},
        %Card{rank: 8, suit: :d},
        %Card{rank: 11, suit: :d},
        %Card{rank: 4, suit: :s},
        %Card{rank: 6, suit: :s},
        %Card{rank: 8, suit: :s},
        %Card{rank: 11, suit: :s},
        %Card{rank: 14, suit: :s}
      ]
    ]
  end
end
