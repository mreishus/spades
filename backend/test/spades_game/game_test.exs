defmodule GameTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.Game
  alias SpadesGame.{Game}

  describe "new/1" do
    test "returns a game" do
      game = Game.new("asdf")
      assert game.draw |> length == 52
      assert game.discard == []
    end
  end

  describe "discard/1" do
    test "discards a card" do
      game = Game.new("discard")
      game2 = Game.discard(game)
      game3 = Game.discard(game2)

      assert game2.draw |> length == 51
      assert game2.discard |> length == 1
      assert game3.draw |> length == 50
      assert game3.discard |> length == 2
    end

    test "does nothing when draw pile is empty" do
      game = Game.new("discard2")
      game = %{game | draw: [], discard: game.draw}
      game2 = Game.discard(game)
      assert game.draw |> length == 0
      assert game.discard |> length == 52
      assert game2.draw |> length == 0
      assert game2.discard |> length == 52
    end
  end
end
