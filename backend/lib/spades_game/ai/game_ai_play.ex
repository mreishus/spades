defmodule SpadesGame.GameAI.Play do
  @moduledoc """
  Functions for the AI figuring out what game to play.
  """
  alias SpadesGame.{Card, Deck, Game, TrickCard}
  # alias SpadesGame.{Card, Game}

  @spec play(Game.t()) :: Card.t()
  def play(%Game{turn: turn} = game) do
    hand = Game.hand(game, turn)
    {:ok, valid_cards} = Game.valid_cards(game, turn)
    play2(game.trick, valid_cards, hand)
  end

  @spec play2(list(TrickCard.t()), Deck.t(), Deck.t()) :: Card.t()
  def play2(_trick, valid_cards, _hand) do
    valid_cards |> Enum.random()
  end

  # First card = last in list by convention
  # game.trick: list(TrickCard.t()),
  # @type t :: %TrickCard{card: Card.t(), seat: :north | :east | :west | :south}
end
