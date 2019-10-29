defmodule GameUiTest do
  use ExUnit.Case, async: true

  alias SpadesGame.{GameUI, GameOptions, Card}

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
      assert gameui.seats.north == 10
    end

    test "A taken seat can't be sat in", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 11, "south")
      gameui = GameUI.sit(gameui, 12, "south")
      assert gameui.seats.south == 11
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
      gameui = GameUI.left(gameui, 12)
      assert gameui.when_seats_full == nil
    end
  end

  describe "left/2" do
    test "Someone can stand up/leave", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 10, "north")
      gameui = GameUI.sit(gameui, 11, "east")
      gameui = GameUI.sit(gameui, 12, "west")
      gameui = GameUI.sit(gameui, 13, "south")
      gameui = GameUI.left(gameui, 12)
      assert gameui.seats.north == 10
      assert gameui.seats.east == 11
      assert gameui.seats.west == nil
      assert gameui.seats.south == 13
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
end
