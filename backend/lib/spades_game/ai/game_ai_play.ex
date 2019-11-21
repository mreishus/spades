defmodule SpadesGame.GameAI.Play do
  @moduledoc """
  Functions for the AI figuring out what game to play.
  """
  alias SpadesGame.{Card, Deck, TrickCard}

  @spec play(list(TrickCard.t()), Deck.t(), Deck.t()) :: Card.t()
  def play(_trick, valid_cards, _hand) do
    valid_cards |> Enum.random()
  end

  # First card = last in list by convention
  # game.trick: list(TrickCard.t()),
  # @type t :: %TrickCard{card: Card.t(), seat: :north | :east | :west | :south}
end
