defmodule SpadesGame.GamePlayer do
  @moduledoc """
  Represents a player inside a game of spades.
  They will have a hand of cards, a card they're playing for the current trick_card, etc.
  A bid, etc.
  """
  alias SpadesGame.{Deck, Card, GamePlayer}

  @derive Jason.Encoder
  defstruct [:hand, :trick_card, :tricks_won]

  @type t :: %GamePlayer{
          hand: Deck.t(),
          trick_card: nil | Card.t(),
          tricks_won: integer
        }

  @doc """
  new/0: Create a new player with an empty hand.
  """
  @spec new() :: GamePlayer.t()
  def new() do
    %GamePlayer{
      hand: Deck.new_empty(),
      trick_card: nil,
      tricks_won: 0
    }
  end

  @doc """
  new/1: Create a new player with the hand passed in.
  """
  @spec new(Deck.t()) :: GamePlayer.t()
  def new(hand) do
    %GamePlayer{
      hand: hand,
      trick_card: nil,
      tricks_won: 0
    }
  end
end
