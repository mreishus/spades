defmodule GamePlayerTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.GamePlayer
  alias SpadesGame.{GamePlayer, Deck}

  describe "new/0" do
    test "I can make a player with a blank hand" do
      p = GamePlayer.new()
      assert p.hand |> length == 0
      assert p.tricks_won == 0
    end
  end

  describe "new/1" do
    test "I can make a player with a given hand" do
      deck1 = Deck.new_shuffled()
      p = GamePlayer.new(deck1 |> Enum.take(10))
      assert p.hand |> length == 10
      assert p.tricks_won == 0
    end
  end
end
