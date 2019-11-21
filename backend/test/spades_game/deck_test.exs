defmodule DeckTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.Deck
  alias SpadesGame.{Card, Deck}

  describe "new_shuffled/1" do
    test "returns a new deck with 52 cards" do
      deck = Deck.new_shuffled()
      assert deck |> length == 52
    end

    test "returns a different deck each time" do
      deck1 = Deck.new_shuffled()
      deck2 = Deck.new_shuffled()
      assert deck1 != deck2
    end
  end

  describe "new_empty/0" do
    test "returns an empty list" do
      deck1 = Deck.new_empty()
      assert deck1 |> length == 0
    end
  end

  describe "shuffle/1" do
    test "changes the card layout" do
      deck1 = Deck.new_shuffled()
      deck2 = Deck.shuffle(deck1)
      assert deck1 != deck2
    end
  end

  describe "count_rank/2" do
    test "works" do
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

      got = h |> Deck.count_rank(11)
      want = 2
      assert got == want
    end
  end

  describe "count_suit/2" do
    test "works" do
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

      got = h |> Deck.count_suit(:s)
      want = 5
      assert got == want
    end
  end

  describe "hardcoded_cards/0" do
    test "gets 4 hands of 13 cards each" do
      [h1, h2, h3, h4] = Deck.hardcoded_cards()
      assert h1 |> length == 13
      assert h2 |> length == 13
      assert h3 |> length == 13
      assert h4 |> length == 13
    end

    test "hands don't overlap" do
      [h1, h2, h3, h4] = Deck.hardcoded_cards()
      assert (h1 -- h2) |> length == 13
      assert (h1 -- h3) |> length == 13
      assert (h1 -- h4) |> length == 13
      assert (h2 -- h3) |> length == 13
      assert (h2 -- h4) |> length == 13
      assert (h3 -- h4) |> length == 13
    end
  end
end
