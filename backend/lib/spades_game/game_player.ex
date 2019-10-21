defmodule SpadesGame.GamePlayer do
  @moduledoc """
  Represents a player inside a game of spades.
  They will have a hand of cards, a card they're playing for the current trick, etc.
  A bid, etc.
  """
  alias SpadesGame.{Deck, Card, GamePlayer}

  @derive Jason.Encoder
  defstruct [:hand, :trick]

  @type t :: %GamePlayer{
          hand: Deck.t(),
          trick: nil | Card.t()
        }

  @spec new() :: GamePlayer.t()
  def new() do
    %GamePlayer{
      hand: Deck.new_empty(),
      trick: nil
    }
  end

  @spec new(Deck.t()) :: GamePlayer.t()
  def new(hand) do
    %GamePlayer{
      hand: hand,
      trick: nil
    }
  end
end
