defmodule GameTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.Game
  alias SpadesGame.{Card, Game, GameOptions, GamePlayer, TrickCard}

  setup do
    {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})
    %{options: options}
  end

  describe "new/1" do
    test "returns a game" do
      game = Game.new("new1")
      assert game.west.hand |> length == 13
      assert game.east.hand |> length == 13
      assert game.north.hand |> length == 13
      assert game.south.hand |> length == 13
    end
  end

  describe "new/2" do
    test "returns a game", %{options: options} do
      game = Game.new("new2", options)
      assert game.west.hand |> length == 13
      assert game.east.hand |> length == 13
      assert game.north.hand |> length == 13
      assert game.south.hand |> length == 13

      # Test Hardcoded Cards
      assert game.west.hand |> Enum.member?(%Card{rank: 7, suit: :h})
      assert game.north.hand |> Enum.member?(%Card{rank: 2, suit: :h})
    end
  end

  describe "bidding" do
    test "round of bids", %{options: options} do
      game = Game.new("bidding", options)
      assert game.status == :bidding
      {:ok, game} = Game.bid(game, :east, 3)
      assert game.status == :bidding
      {:ok, game} = Game.bid(game, :south, 4)
      assert game.status == :bidding
      {:ok, game} = Game.bid(game, :west, 2)
      assert game.status == :bidding
      {:ok, game} = Game.bid(game, :north, 0)
      assert game.status == :playing
      assert game.east.bid == 3
      assert game.south.bid == 4
      assert game.west.bid == 2
      assert game.north.bid == 0
      assert game.turn == :east
    end
  end

  describe "move/1" do
    test "First Trick Works", %{options: options} do
      game = Game.new("move1 first trick", options)

      card_e = %Card{rank: 12, suit: :h}
      card_s = %Card{rank: 9, suit: :h}
      card_w = %Card{rank: 7, suit: :h}
      card_n = %Card{rank: 2, suit: :h}

      assert {:ok, game} = Game.bid(game, :east, 3)
      assert {:ok, game} = Game.bid(game, :south, 4)
      assert {:ok, game} = Game.bid(game, :west, 2)
      assert {:ok, game} = Game.bid(game, :north, 0)

      assert {:error, "Inactive player attempted to play a card or bid"} =
               Game.play(game, :south, card_s)

      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      assert {:ok, game} = Game.play(game, :west, card_w)
      assert game.trick |> length == 3
      assert {:ok, game} = Game.play(game, :north, card_n)
      assert game.trick |> length == 4
      game = Game.rewind_trickfull_devtest(game)
      assert game.trick |> length == 0
      assert game.turn == :east
      assert game.east.tricks_won == 1
      # game |> IO.inspect(label: "label")
    end

    test "Forced to follow suit if possible", %{options: options} do
      game = Game.new("move1 follow suit", options)

      card_e = %Card{rank: 12, suit: :h}
      card_s = %Card{rank: 9, suit: :h}
      card_w = %Card{rank: 13, suit: :s}

      assert {:ok, game} = Game.bid(game, :east, 3)
      assert {:ok, game} = Game.bid(game, :south, 4)
      assert {:ok, game} = Game.bid(game, :west, 2)
      assert {:ok, game} = Game.bid(game, :north, 0)

      assert {:ok, game} = Game.play(game, :east, card_e)
      assert {:ok, game} = Game.play(game, :south, card_s)
      assert {:error, _} = Game.play(game, :west, card_w)
    end

    test "Spades must be broken before playing", %{options: options} do
      game = Game.new("move1 spades broken", options)

      assert {:ok, game} = Game.bid(game, :east, 3)
      assert {:ok, game} = Game.bid(game, :south, 4)
      assert {:ok, game} = Game.bid(game, :west, 2)
      assert {:ok, game} = Game.bid(game, :north, 0)

      card_e = %Card{rank: 9, suit: :s}
      assert {:error, _x} = Game.play(game, :east, card_e)
    end

    test "it's ok to play a spade if that's all you have left", %{options: options} do
      game = Game.new("move1 spades only cards in hand", options)

      assert {:ok, game} = Game.bid(game, :east, 3)
      assert {:ok, game} = Game.bid(game, :south, 4)
      assert {:ok, game} = Game.bid(game, :west, 2)
      assert {:ok, game} = Game.bid(game, :north, 0)

      game = %{
        game
        | east: %GamePlayer{
            bid: 3,
            tricks_won: 0,
            hand: [
              %SpadesGame.Card{rank: 2, suit: :s},
              %SpadesGame.Card{rank: 3, suit: :s},
              %SpadesGame.Card{rank: 9, suit: :s}
            ]
          }
      }

      card_e = %Card{rank: 9, suit: :s}
      assert {:ok, game} = Game.play(game, :east, card_e)
    end

    test "Spades can be broken", %{options: options} do
      game = Game.new("move1 break spades", options)
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
      assert {:ok, game} = Game.play(game, :south, card_s)
      game = Game.rewind_trickfull_devtest(game)

      assert game.east.tricks_won == 1
      assert game.west.tricks_won == 1
      assert game.south.tricks_won == 1
      assert game.spades_broken == true
    end
  end

  describe "trick_winner/1" do
    test "Simple case" do
      winner =
        Game.trick_winner([
          %TrickCard{card: %Card{rank: 7, suit: :h}, seat: :north},
          %TrickCard{card: %Card{rank: 2, suit: :h}, seat: :west},
          %TrickCard{card: %Card{rank: 10, suit: :h}, seat: :south},
          %TrickCard{card: %Card{rank: 9, suit: :h}, seat: :east}
        ])

      assert winner == %TrickCard{card: %Card{rank: 10, suit: :h}, seat: :south}
    end

    test "Offsuit high card doesn't win" do
      winner =
        Game.trick_winner([
          %TrickCard{card: %Card{rank: 7, suit: :h}, seat: :north},
          %TrickCard{card: %Card{rank: 2, suit: :h}, seat: :west},
          %TrickCard{card: %Card{rank: 12, suit: :c}, seat: :south},
          %TrickCard{card: %Card{rank: 9, suit: :h}, seat: :east}
        ])

      assert winner == %TrickCard{card: %Card{rank: 9, suit: :h}, seat: :east}
    end

    test "Low spade wins" do
      winner =
        Game.trick_winner([
          %TrickCard{card: %Card{rank: 7, suit: :h}, seat: :north},
          %TrickCard{card: %Card{rank: 2, suit: :s}, seat: :west},
          %TrickCard{card: %Card{rank: 12, suit: :h}, seat: :south},
          %TrickCard{card: %Card{rank: 9, suit: :h}, seat: :east}
        ])

      assert winner == %TrickCard{card: %Card{rank: 2, suit: :s}, seat: :west}
    end

    test "Nothing beats spades" do
      winner =
        Game.trick_winner([
          %TrickCard{card: %Card{rank: 9, suit: :s}, seat: :north},
          %TrickCard{card: %Card{rank: 2, suit: :s}, seat: :west},
          %TrickCard{card: %Card{rank: 12, suit: :c}, seat: :south},
          %TrickCard{card: %Card{rank: 5, suit: :s}, seat: :east}
        ])

      assert winner == %TrickCard{card: %Card{rank: 9, suit: :s}, seat: :north}
    end
  end

  describe "valid_cards/2" do
    test "works", %{options: options} do
      game = Game.new("valid_cards abc", options)

      assert {:ok, game} = Game.bid(game, :east, 3)
      assert {:ok, game} = Game.bid(game, :south, 4)
      assert {:ok, game} = Game.bid(game, :west, 2)
      assert {:ok, game} = Game.bid(game, :north, 0)

      # Check east valid's cards (Lead)
      {:ok, east_valid_cards} = Game.valid_cards(game, :east)
      assert length(east_valid_cards) == 10
      assert east_valid_cards |> Enum.filter(fn card -> card.suit == :s end) |> length == 0

      # East plays hearts
      card_e = %Card{rank: 12, suit: :h}
      assert {:ok, game} = Game.play(game, :east, card_e)

      # Check south's valid cards - forced to follow heart
      {:ok, south_valid_cards} = Game.valid_cards(game, :south)
      assert length(south_valid_cards) == 2
      assert south_valid_cards |> Enum.filter(fn card -> card.suit == :h end) |> length == 2
    end
  end
end
