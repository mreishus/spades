import Ecto

defmodule SpadesGame.Stack do
  @moduledoc """
  Represents a stack of cards. Most of the time it contains just 1 card, but can have multiple attached cards.
  """
  alias SpadesGame.{Card,Stack}

  @type t :: Map.t()

  @spec new_test() :: Map.t()
  def new_test() do
    %{"id" => Ecto.UUID.generate, "cards" => [Card.new_test1(),Card.new_test2(),Card.new_test3(),Card.new_test2()]}
#    %Stack{id=> Ecto.UUID.generate, "cards"=> [Card.new_test2()]}
  end

  def new_test1() do
    %{"id" => Ecto.UUID.generate, "cards" => [Card.new_test1()]}
  end

  def new_test2() do
    %{"id" => Ecto.UUID.generate, "cards" => [Card.new_test2()]}
  end

  def new_testq() do
    %{"id" => Ecto.UUID.generate, "cards" => [Card.new_testq()]}
  end

  @spec stack_from_card(Card.t()) :: Map.t()
  def stack_from_card(card) do
    %{"id" => Ecto.UUID.generate, "cards" => [card]}
  end

  @spec stack_from_cardrow(Map.t()) :: Map.t()
  def stack_from_cardrow(card_row) do
    #IO.puts("card_row")
    #IO.inspect(card_row)
    %{"id" => Ecto.UUID.generate, "cards" => [Card.card_from_cardrow(card_row)]}
  end
end
