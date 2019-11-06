defmodule SpadesGame.TrickCard do
  @moduledoc """
  Represents a single card laid down on the table.
  A trick is made of several TrickCards.
  """
  @derive Jason.Encoder
  defstruct [:card, :seat]
  alias SpadesGame.{Card, TrickCard}

  @type t :: %TrickCard{card: Card.t(), seat: :north | :east | :west | :south}
end
