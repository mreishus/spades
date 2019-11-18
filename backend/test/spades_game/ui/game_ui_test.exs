defmodule GameUiTest do
  use ExUnit.Case, async: true

  alias SpadesGame.{Card, GameOptions, GameUI}

  setup do
    game_name = "game-#{:rand.uniform(1000)}"
    {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

    gameui = GameUI.new(game_name, options)
    %{gameui: gameui}
  end

  describe "new/2" do
    test "Creates a new GameUI" do
      game_name = "game-#{:rand.uniform(1000)}"
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      gameui = GameUI.new(game_name, options)
      # Test Hardcoded Cards
      assert gameui.game.west.hand |> Enum.member?(%Card{rank: 7, suit: :h})
      assert gameui.game.north.hand |> Enum.member?(%Card{rank: 2, suit: :h})
    end
  end

  describe "sit/3" do
    test "Someone can sit", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 10, "north")
      assert gameui.seats.north.sitting == 10
    end

    test "A taken seat can't be sat in", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 11, "south")
      gameui = GameUI.sit(gameui, 12, "south")
      assert gameui.seats.south.sitting == 11
    end
  end

  describe "check_full_seats/1" do
    test "When all seats are filled, a timestamp is set", %{gameui: gameui} do
      assert gameui.when_seats_full == nil
      gameui = GameUI.sit(gameui, 10, "north")
      assert gameui.when_seats_full == nil
      gameui = GameUI.sit(gameui, 11, "east")
      assert gameui.when_seats_full == nil
      gameui = GameUI.sit(gameui, 12, "west")
      assert gameui.when_seats_full == nil
      gameui = GameUI.sit(gameui, 13, "south")
      assert gameui.when_seats_full != nil
    end

    test "When a timestamp is set, someone leaving clears it", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 10, "north")
      gameui = GameUI.sit(gameui, 11, "east")
      gameui = GameUI.sit(gameui, 12, "west")
      gameui = GameUI.sit(gameui, 13, "south")
      assert gameui.when_seats_full != nil
      gameui = GameUI.leave(gameui, 12)
      assert gameui.when_seats_full == nil
    end
  end

  describe "leave/2" do
    test "Someone can stand up/leave", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 10, "north")
      gameui = GameUI.sit(gameui, 11, "east")
      gameui = GameUI.sit(gameui, 12, "west")
      gameui = GameUI.sit(gameui, 13, "south")
      gameui = GameUI.leave(gameui, 12)
      assert gameui.seats.north.sitting == 10
      assert gameui.seats.east.sitting == 11
      assert gameui.seats.west.sitting == nil
      assert gameui.seats.south.sitting == 13
    end
  end

  describe "check_status_advance/1" do
    test "Everyone sitting for 10 seconds moves a gameui from staging to playing", %{
      gameui: gameui
    } do
      gameui = GameUI.sit(gameui, 10, "north")
      gameui = GameUI.sit(gameui, 11, "east")
      gameui = GameUI.sit(gameui, 12, "west")
      gameui = GameUI.sit(gameui, 13, "south")
      assert gameui.when_seats_full != nil
      one_minute_ago = DateTime.utc_now() |> DateTime.add(-1 * 60, :second)
      gameui = %{gameui | when_seats_full: one_minute_ago}
      gameui = GameUI.check_status_advance(gameui)
      assert gameui.status == :playing
    end
  end

  describe "bid/3" do
    test "Round of bidding", %{gameui: gameui} do
      ## First, move to playing status by having everyone sit
      gameui = GameUI.sit(gameui, 10, "north")
      gameui = GameUI.sit(gameui, 11, "east")
      gameui = GameUI.sit(gameui, 12, "west")
      gameui = GameUI.sit(gameui, 13, "south")
      assert gameui.when_seats_full != nil
      one_minute_ago = DateTime.utc_now() |> DateTime.add(-1 * 60, :second)
      gameui = %{gameui | when_seats_full: one_minute_ago}
      gameui = GameUI.check_status_advance(gameui)
      assert gameui.status == :playing
      ## Now, do a round of bids
      assert gameui.game.status == :bidding
      gameui = GameUI.bid(gameui, 11, 5)
      gameui = GameUI.bid(gameui, 13, 4)
      gameui = GameUI.bid(gameui, 12, 3)
      gameui = GameUI.bid(gameui, 10, 2)
      assert gameui.game.status == :playing
      assert gameui.game.east.bid == 5
      assert gameui.game.south.bid == 4
      assert gameui.game.west.bid == 3
      assert gameui.game.north.bid == 2
    end
  end

  describe "play/3" do
    test "Round of playing", %{gameui: gameui} do
      ## First, move to playing status by having everyone sit
      gameui = GameUI.sit(gameui, 10, "north")
      gameui = GameUI.sit(gameui, 11, "east")
      gameui = GameUI.sit(gameui, 12, "west")
      gameui = GameUI.sit(gameui, 13, "south")
      assert gameui.when_seats_full != nil
      one_minute_ago = DateTime.utc_now() |> DateTime.add(-1 * 60, :second)
      gameui = %{gameui | when_seats_full: one_minute_ago}
      gameui = GameUI.check_status_advance(gameui)
      assert gameui.status == :playing
      ## Now, do a round of bids
      assert gameui.game.status == :bidding
      gameui = GameUI.bid(gameui, 11, 5)
      gameui = GameUI.bid(gameui, 13, 4)
      gameui = GameUI.bid(gameui, 12, 3)
      gameui = GameUI.bid(gameui, 10, 2)
      assert gameui.game.status == :playing
      ## Next, let's play some cards

      card_e = %Card{rank: 12, suit: :h}
      card_s = %Card{rank: 9, suit: :h}
      card_w = %Card{rank: 7, suit: :h}
      card_n = %Card{rank: 2, suit: :h}

      gameui = GameUI.play(gameui, 11, card_e)
      gameui = GameUI.play(gameui, 13, card_s)
      gameui = GameUI.play(gameui, 12, card_w)
      assert gameui.game.trick |> length == 3
      gameui = GameUI.play(gameui, 10, card_n)
      assert gameui.game.trick |> length == 4
      gameui = GameUI.rewind_trickfull_devtest(gameui)
      assert gameui.game.trick |> length == 0
      assert gameui.game.east.tricks_won == 1
      assert gameui.game.turn == :east
    end
  end

  describe "everyone_sitting?/1" do
    test "works", %{gameui: gameui} do
      refute GameUI.everyone_sitting?(gameui)
      gameui = GameUI.sit(gameui, 10, "north")
      refute GameUI.everyone_sitting?(gameui)
      gameui = GameUI.sit(gameui, 11, "east")
      refute GameUI.everyone_sitting?(gameui)
      gameui = GameUI.sit(gameui, 12, "west")
      refute GameUI.everyone_sitting?(gameui)
      gameui = GameUI.sit(gameui, 13, "south")
      assert GameUI.everyone_sitting?(gameui)
    end
  end

  describe "censor_hands/1" do
    test "censors hands", %{gameui: gameui} do
      censored = GameUI.censor_hands(gameui)
      assert censored.game.south.hand == []
      assert censored.game.west.hand == []
      assert censored.game.east.hand == []
      assert censored.game.north.hand == []
    end
  end

  describe "bot stuff" do
    test "invite_bots", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 10, "north")
      assert gameui.when_seats_full == nil
      gameui = GameUI.invite_bots(gameui)
      assert gameui.when_seats_full != nil
    end

    test "bid, play and user_id_to_seat for bots", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 10, "north")
      assert gameui.when_seats_full == nil
      gameui = GameUI.invite_bots(gameui)
      assert gameui.when_seats_full != nil
      one_minute_ago = DateTime.utc_now() |> DateTime.add(-1 * 60, :second)
      gameui = %{gameui | when_seats_full: one_minute_ago}
      gameui = GameUI.check_status_advance(gameui)
      assert gameui.status == :playing

      ## Now, do a round of bids
      assert gameui.game.status == :bidding

      ## Current :bot is east
      assert :east == GameUI.user_id_to_seat(gameui, :bot)
      gameui = GameUI.bid(gameui, :bot, 3)
      ## Current :bot is south
      assert :south == GameUI.user_id_to_seat(gameui, :bot)
      gameui = GameUI.bid(gameui, :bot, 3)
      ## Current :bot is west
      assert :west == GameUI.user_id_to_seat(gameui, :bot)
      gameui = GameUI.bid(gameui, :bot, 3)
      ## North, a real player bids
      gameui = GameUI.bid(gameui, 10, 2)
      assert gameui.game.status == :playing

      ## Do a trick with bots
      card_e = %Card{rank: 12, suit: :h}
      card_s = %Card{rank: 9, suit: :h}
      card_w = %Card{rank: 7, suit: :h}
      card_n = %Card{rank: 2, suit: :h}

      gameui = GameUI.play(gameui, :bot, card_e)
      gameui = GameUI.play(gameui, :bot, card_s)
      gameui = GameUI.play(gameui, :bot, card_w)
      assert gameui.game.trick |> length == 3
      gameui = GameUI.play(gameui, 10, card_n)
      assert gameui.game.trick |> length == 4
      gameui = GameUI.rewind_trickfull_devtest(gameui)
      assert gameui.game.trick |> length == 0
    end
  end
end
