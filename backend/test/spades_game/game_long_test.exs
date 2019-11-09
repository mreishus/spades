defmodule GameLongTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.Game
  alias SpadesGame.{Game, GameOptions, Card}

  setup do
    {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})
    %{options: options}
  end

  describe "move/1" do
    test "Entire Game", %{options: options} do
      game = Game.new("game long test", options)
      assert game.spades_broken == false

      assert {:ok, game} = Game.bid(game, :east, 3)
      assert {:ok, game} = Game.bid(game, :south, 4)
      assert {:ok, game} = Game.bid(game, :west, 2)
      assert {:ok, game} = Game.bid(game, :north, 0)

      card_e = %Card{rank: 12, suit: :h}
      card_s = %Card{rank: 9, suit: :h}
      card_w = %Card{rank: 7, suit: :h}
      card_n = %Card{rank: 2, suit: :h}

      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      game = Game.rewind_trickfull_devtest(game)

      assert game.spades_broken == false

      card_e = %Card{rank: 6, suit: :h}
      card_s = %Card{rank: 4, suit: :h}
      card_w = %Card{rank: 10, suit: :h}
      card_n = %Card{rank: 3, suit: :h}

      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      game = Game.rewind_trickfull_devtest(game)

      assert game.spades_broken == false

      card_w = %Card{rank: 13, suit: :h}
      card_n = %Card{rank: 5, suit: :h}
      card_e = %Card{rank: 2, suit: :s}
      card_s = %Card{rank: 4, suit: :s}

      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      assert {:ok, game} = Game.play(game, :east, card_e)
      # Winner
      assert {:ok, game} = Game.play(game, :south, card_s)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 1
      assert game.west.tricks_won == 1
      assert game.south.tricks_won == 1
      assert game.spades_broken == true

      card_s = %Card{rank: 3, suit: :c}
      card_w = %Card{rank: 2, suit: :c}
      card_n = %Card{rank: 12, suit: :c}
      card_e = %Card{rank: 14, suit: :c}

      assert {:ok, game} = Game.play(game, :south, card_s)
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      # Winner
      assert {:ok, game} = Game.play(game, :east, card_e)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 2
      assert game.west.tricks_won == 1
      assert game.south.tricks_won == 1

      card_e = %Card{rank: 3, suit: :d}
      card_s = %Card{rank: 2, suit: :d}
      card_w = %Card{rank: 14, suit: :d}
      card_n = %Card{rank: 5, suit: :d}

      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      # Winner
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 2
      assert game.west.tricks_won == 2
      assert game.south.tricks_won == 1

      card_w = %Card{rank: 11, suit: :h}
      card_n = %Card{rank: 14, suit: :h}
      card_e = %Card{rank: 3, suit: :s}
      card_s = %Card{rank: 6, suit: :s}

      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      assert {:ok, game} = Game.play(game, :east, card_e)
      # Winner
      assert {:ok, game} = Game.play(game, :south, card_s)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 2
      assert game.west.tricks_won == 2
      assert game.south.tricks_won == 2

      card_s = %Card{rank: 10, suit: :c}
      card_w = %Card{rank: 11, suit: :c}
      card_n = %Card{rank: 6, suit: :c}
      card_e = %Card{rank: 8, suit: :c}

      assert {:ok, game} = Game.play(game, :south, card_s)
      # Winner
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      assert {:ok, game} = Game.play(game, :east, card_e)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 2
      assert game.west.tricks_won == 3
      assert game.south.tricks_won == 2

      card_w = %Card{rank: 4, suit: :c}
      card_n = %Card{rank: 9, suit: :c}
      card_e = %Card{rank: 9, suit: :s}
      card_s = %Card{rank: 13, suit: :c}

      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      # Winner
      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 3
      assert game.west.tricks_won == 3
      assert game.south.tricks_won == 2

      card_e = %Card{rank: 13, suit: :d}
      card_s = %Card{rank: 8, suit: :d}
      card_w = %Card{rank: 9, suit: :d}
      card_n = %Card{rank: 6, suit: :d}

      # Winner
      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 4
      assert game.west.tricks_won == 3
      assert game.south.tricks_won == 2

      card_e = %Card{rank: 12, suit: :d}
      card_s = %Card{rank: 11, suit: :d}
      card_w = %Card{rank: 5, suit: :c}
      card_n = %Card{rank: 8, suit: :h}

      # Winner
      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 5
      assert game.west.tricks_won == 3
      assert game.south.tricks_won == 2

      card_e = %Card{rank: 10, suit: :d}
      card_s = %Card{rank: 8, suit: :s}
      card_w = %Card{rank: 10, suit: :s}
      card_n = %Card{rank: 7, suit: :s}

      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      # Winner
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 5
      assert game.west.tricks_won == 4
      assert game.south.tricks_won == 2

      card_w = %Card{rank: 12, suit: :s}
      card_n = %Card{rank: 5, suit: :s}
      card_e = %Card{rank: 4, suit: :d}
      card_s = %Card{rank: 14, suit: :s}

      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      assert {:ok, game} = Game.play(game, :east, card_e)
      # Winner
      assert {:ok, game} = Game.play(game, :south, card_s)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 5
      assert game.west.tricks_won == 4
      assert game.south.tricks_won == 3

      card_s = %Card{rank: 11, suit: :s}
      card_w = %Card{rank: 13, suit: :s}
      card_n = %Card{rank: 7, suit: :c}
      card_e = %Card{rank: 7, suit: :d}

      assert {:ok, game} = Game.play(game, :south, card_s)
      # Winner
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert {:ok, game} = Game.play(game, :north, card_n)
      assert {:ok, game} = Game.play(game, :east, card_e)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 5
      assert game.west.tricks_won == 5
      assert game.south.tricks_won == 3

      assert game.west.hand |> length == 0
      assert game.east.hand |> length == 0
      assert game.north.hand |> length == 0
      assert game.south.hand |> length == 0

      # game |> IO.inspect(label: "game")
      ## Need bidding, scoring, etc
    end
  end
end
