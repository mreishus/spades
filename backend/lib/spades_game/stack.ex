defmodule SpadesGame.Stack do
  @moduledoc """
  Represents a stack of cards. Most of the time it contains just 1 card, but can have multiple attached cards.
  """
  alias SpadesGame.{Card}

  @type t :: Map.t()

  @spec empty_stack() :: Map.t()
  def empty_stack() do
    %{
      "id" => Ecto.UUID.generate,
      "card_ids" => []
    }
  end

  @spec stack_from_card(Card.t()) :: Map.t()
  def stack_from_card(card) do
    %{
      "id" => Ecto.UUID.generate,
      "card_ids" => [card["id"]]
    }
  end

  @spec stack_from_cardrow(Card.t()) :: Map.t()
  def stack_from_cardrow(card) do
    #IO.puts("card_row")
    #IO.inspect(card_row)
    %{
      "id" => Ecto.UUID.generate,
      "card_ids" => [card["id"]]
    }
  end

  @spec stack_from_cardrow(Map.t(), String.t()) :: Map.t()
  def stack_from_cardrow(card_row, controller) do
    #IO.puts("card_row")
    #IO.inspect(card_row)
    %{
      "id" => Ecto.UUID.generate,
      "card_ids" => [Card.card_from_cardrow(card_row, controller)]
    }
  end
end
