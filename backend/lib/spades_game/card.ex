defmodule SpadesGame.Card do
  @moduledoc """
  Represents a playing card.
  """
  defstruct [:rank, :suit]
  alias SpadesGame.Card

  @type t :: %Card{rank: rank, suit: suit}
  @type suit :: :h | :d | :c | :s
  @type rank :: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14

  def suits(), do: [:h, :d, :c, :s]
  def ranks(), do: Enum.to_list(2..14)
end
