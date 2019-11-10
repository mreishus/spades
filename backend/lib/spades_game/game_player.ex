defmodule SpadesGame.GamePlayer do
  @moduledoc """
  Represents a player inside a game of spades.
  They will have a hand of cards, a bid etc.
  """
  alias SpadesGame.{Deck, Card, GamePlayer}

  @derive Jason.Encoder
  defstruct [:hand, :tricks_won, :bid]

  use Accessible

  @type t :: %GamePlayer{
          hand: Deck.t(),
          tricks_won: integer,
          bid: nil | integer
        }

  @doc """
  new/0: Create a new player with an empty hand.
  """
  @spec new() :: GamePlayer.t()
  def new() do
    %GamePlayer{
      hand: Deck.new_empty(),
      tricks_won: 0,
      bid: nil
    }
  end

  @doc """
  new/1: Create a new player with the hand passed in.
  """
  @spec new(Deck.t()) :: GamePlayer.t()
  def new(hand) do
    %GamePlayer{
      hand: hand,
      tricks_won: 0,
      bid: nil
    }
  end

  @doc """
  won_trick/1: Increment the number of tricks won by 1.
  """
  @spec won_trick(GamePlayer.t()) :: GamePlayer.t()
  def won_trick(player) do
    %GamePlayer{player | tricks_won: player.tricks_won + 1}
  end

  @spec set_bid(GamePlayer.t(), nil | integer) :: GamePlayer.t()
  def set_bid(player, bid) when is_nil(bid) or (bid >= 0 and bid <= 13) do
    %GamePlayer{player | bid: bid}
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

  @spec has_suit?(GamePlayer.t(), :s | :h | :c | :d) :: boolean
  def has_suit?(player, suit) do
    player.hand |> Enum.any?(fn card -> card.suit == suit end)
  end

  def hand_length(player) do
    player.hand |> length()
  end

  def spades_length(player) do
    player.hand |> Enum.filter(fn card -> card.suit == :s end) |> length()
  end
end
