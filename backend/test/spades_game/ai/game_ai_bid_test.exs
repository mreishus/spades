defmodule GameAiBidTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.GameAI.Bid
  alias SpadesGame.{Card, Deck}
  alias SpadesGame.GameAI.Bid

  # Check the total bids
  # Deck.new_shuffled() |> Enum.chunk_every(13) |> Enum.map(fn x -> {Deck.sort(x), GameAI.soft_bid(x)} end) |> Enum.map(fn {h, b} -> b end) |> Enum.sum

  describe "clamp_bid/1" do
    test "reduces max" do
      assert Bid.clamp_bid(8) == 7
      assert Bid.clamp_bid(10) == 7
    end

    test "increases min" do
      assert Bid.clamp_bid(0) == 1
    end

    test "does nothing to mid" do
      assert Bid.clamp_bid(1) == 1
      assert Bid.clamp_bid(4) == 4
      assert Bid.clamp_bid(7) == 7
    end
  end

  describe "bag_adjust/1" do
    test "does nothing to low bids" do
      assert Bid.bag_adjust(4, 4) == 4
    end

    test "does nothing to unknown partner bids" do
      assert Bid.bag_adjust(4, nil) == 4
      assert Bid.bag_adjust(12, nil) == 12
      assert Bid.bag_adjust(0, nil) == 0
    end

    test "does nothing to nil bids" do
      assert Bid.bag_adjust(0, nil) == 0
      assert Bid.bag_adjust(0, 4) == 0
      assert Bid.bag_adjust(0, 12) == 0
    end

    test "reduces high bids" do
      assert Bid.bag_adjust(6, 6) == 5
      assert Bid.bag_adjust(7, 6) == 5
      assert Bid.bag_adjust(6, 7) == 4
      assert Bid.bag_adjust(7, 7) == 4
    end
  end

  describe "pick_bid/1" do
    test "pick soft when partner hasn't bid" do
      assert Bid.pick_bid(1, 2, nil) == 1
      assert Bid.pick_bid(2, 1, nil) == 2
    end

    test "pick soft when partner bids under 7" do
      assert Bid.pick_bid(1, 2, 5) == 1
      assert Bid.pick_bid(1, 2, 0) == 1
    end

    test "pick hard when partner bids above or eq 7" do
      assert Bid.pick_bid(1, 2, 7) == 2
      assert Bid.pick_bid(1, 2, 10) == 2
    end
  end

  describe "ballpark" do
    test "bidding is in the correct ballpark" do
      get_random_hand_total = fn ->
        Deck.new_shuffled()
        |> Enum.chunk_every(13)
        |> Enum.map(fn x -> {Deck.sort(x), Bid.bid(x, nil)} end)
        |> Enum.map(fn {_h, b} -> b end)
        |> Enum.sum()
      end

      avg_total_bid =
        1..100
        |> Enum.map(fn _ -> get_random_hand_total.() end)
        |> Enum.sum()
        |> div(100)

      # Currently, I always get 9-10 with this test
      assert avg_total_bid >= 8
      assert avg_total_bid <= 11

      # To test in IEX while looking
      # Deck.new_shuffled() |> Enum.chunk_every(13) |> Enum.map(fn x -> {Deck.sort(x), GameAI.Bid.bid(x, nil)} end)
    end
  end

  describe "low_spade_points/1" do
    test "points from hand" do
      h = [
        %Card{rank: 4, suit: :h},
        %Card{rank: 9, suit: :h},
        %Card{rank: 3, suit: :c},
        %Card{rank: 10, suit: :c},
        %Card{rank: 13, suit: :c},
        %Card{rank: 2, suit: :d},
        %Card{rank: 8, suit: :d},
        %Card{rank: 11, suit: :d},
        %Card{rank: 4, suit: :s},
        %Card{rank: 6, suit: :s},
        %Card{rank: 8, suit: :s},
        %Card{rank: 11, suit: :s},
        %Card{rank: 14, suit: :s}
      ]

      got = Bid.low_spade_points(h)
      want = 1
      assert got == want
    end

    test "points from count" do
      got = 0..8 |> Enum.to_list() |> Enum.map(fn x -> Bid.low_spade_points_from_count(x) end)
      want = [0, 0, 0, 1, 1, 1, 2, 2, 3]
      assert got == want
    end
  end

  describe "hard_bid/1" do
    test "works" do
      h1 = [
        %Card{rank: 2, suit: :h},
        %Card{rank: 3, suit: :d},
        %Card{rank: 14, suit: :h},
        %Card{rank: 14, suit: :c},
        %Card{rank: 3, suit: :s},
        %Card{rank: 9, suit: :c},
        %Card{rank: 10, suit: :s},
        %Card{rank: 11, suit: :c},
        %Card{rank: 6, suit: :c},
        %Card{rank: 13, suit: :c},
        %Card{rank: 12, suit: :d},
        %Card{rank: 8, suit: :s},
        %Card{rank: 4, suit: :h}
      ]

      assert Bid.hard_bid(h1) == 0

      # A Q = 1
      h2 = [
        %Card{rank: 2, suit: :h},
        %Card{rank: 14, suit: :s},
        %Card{rank: 12, suit: :s}
      ]

      assert Bid.hard_bid(h2) == 1

      # A K Q = 3
      h3 = [
        %Card{rank: 2, suit: :h},
        %Card{rank: 14, suit: :s},
        %Card{rank: 13, suit: :s},
        %Card{rank: 12, suit: :s}
      ]

      assert Bid.hard_bid(h3) == 3
      assert Bid.hard_bid(h3 |> Enum.reverse()) == 3

      # _ K Q J = 0
      # Perhaps this should be worth 2?
      h4 = [
        %Card{rank: 2, suit: :h},
        %Card{rank: 13, suit: :s},
        %Card{rank: 12, suit: :s},
        %Card{rank: 11, suit: :s}
      ]

      assert Bid.hard_bid(h4) == 0
      # assert Bid.hard_bid(h4) == 2

      # _ _ Q J 10 = 0
      # Perhaps this should be worth 1?
      h5 = [
        %Card{rank: 2, suit: :h},
        %Card{rank: 10, suit: :s},
        %Card{rank: 12, suit: :s},
        %Card{rank: 11, suit: :s}
      ]

      assert Bid.hard_bid(h5) == 0
      # assert Bid.hard_bid(h5) == 1
    end
  end
end
