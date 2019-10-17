defmodule CardTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.Card
  alias SpadesGame.{Card}

  describe "basic" do
    test "i can make cards" do
      c = %Card{rank: 5, suit: :s}
      assert %Card{} = c
    end

    test "cards with same rank/suit are equal" do
      c1 = %Card{rank: 6, suit: :h}
      c2 = %Card{rank: 6, suit: :h}
      c3 = %Card{rank: 10, suit: :s}
      assert c1 == c2
      refute c1 == c3
      refute c2 == c3
    end
  end

  describe "suits and ranks" do
    test "there are 4 suits" do
      assert Card.suits() |> length == 4
    end

    test "there are 13 ranks" do
      assert Card.ranks() |> length == 13
    end
  end
end
