defmodule GamePlayerTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.GamePlayer
  alias SpadesGame.{Card, GamePlayer, Deck}

  setup do
    [w, _n, _e, _s] =
      Deck.hardcoded_cards()
      |> Enum.map(fn d -> GamePlayer.new(d) end)

    %{west: w}
  end

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

    test "I can make a player with the same hardcoded hand used in Game", %{west: west} do
      assert west.hand |> Enum.member?(%Card{rank: 7, suit: :h})
    end
  end

  describe "move/1" do
    test "I can play a card I have", %{west: west} do
      card = %Card{rank: 7, suit: :h}
      {:ok, west, card_return} = GamePlayer.play(west, card)
      assert west.hand |> length == 12
      refute west.hand |> Enum.member?(card)
      assert card_return == card
    end

    test "I can't play a card I don't have", %{west: west} do
      card = %Card{rank: 2, suit: :h}
      {:error, west} = GamePlayer.play(west, card)
      assert west.hand |> length == 13
      refute west.hand |> Enum.member?(card)
    end
  end
end
