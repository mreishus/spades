defmodule SpadesGame.GamePlayer do
  @moduledoc """
  Represents a player inside a game of spades.
  They will have a hand of cards, a bid etc.
  """
  alias SpadesGame.{Deck, Card, GamePlayer}

  @derive Jason.Encoder
  defstruct [:hand, :tricks_won]

  @type t :: %GamePlayer{
          hand: Deck.t(),
          tricks_won: integer
        }

  @doc """
  new/0: Create a new player with an empty hand.
  """
  @spec new() :: GamePlayer.t()
  def new() do
    %GamePlayer{
      hand: Deck.new_empty(),
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
      tricks_won: 0
    }
  end

  @doc """
  play/1: Have a player move a card from their hand to a trick.
  """
  @spec play(GamePlayer.t(), Card.t()) ::
          {:ok, GamePlayer.t(), Card.t()} | {:error, GamePlayer.t()}
  def play(player, card) do
    case player.hand |> Enum.member?(card) do
      true -> {:ok, _play(player, card), card}
      false -> {:error, player}
    end
  end

  # _play/1: Have a player move a card from their hand to a trick.
  # Private.  We've already validated they have the card in their hand.
  @spec _play(GamePlayer.t(), Card.t()) :: GamePlayer.t()
  defp _play(player, card) do
    new_hand = player.hand |> Enum.reject(fn x -> x == card end)
    %{player | hand: new_hand}
  end
end
