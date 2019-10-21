defmodule GameTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.Game
  alias SpadesGame.{Game, GameOptions}

  setup do
    {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})
    %{options: options}
  end

  describe "new/1" do
    test "returns a game", %{options: options} do
      game = Game.new("asdf")
      assert game.draw |> length == 52
      assert game.discard == []
      assert game.west.hand |> length == 13
      assert game.east.hand |> length == 13
      assert game.north.hand |> length == 13
      assert game.south.hand |> length == 13
    end
  end

  describe "new/2" do
    test "returns a game", %{options: options} do
      game = Game.new("asdf", options)
      assert game.draw |> length == 52
      assert game.discard == []
      assert game.west.hand |> length == 13
      assert game.east.hand |> length == 13
      assert game.north.hand |> length == 13
      assert game.south.hand |> length == 13
    end
  end

  describe "discard/1" do
    test "discards a card", %{options: options} do
      game = Game.new("discard", options)
      game2 = Game.discard(game)
      game3 = Game.discard(game2)

      assert game2.draw |> length == 51
      assert game2.discard |> length == 1
      assert game3.draw |> length == 50
      assert game3.discard |> length == 2
    end

    test "does nothing when draw pile is empty", %{options: options} do
      game = Game.new("discard2", options)
      game = %{game | draw: [], discard: game.draw}
      game2 = Game.discard(game)
      assert game.draw |> length == 0
      assert game.discard |> length == 52
      assert game2.draw |> length == 0
      assert game2.discard |> length == 52
    end
  end
end
