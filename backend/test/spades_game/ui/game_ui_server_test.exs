defmodule GameUiServerTest do
  use ExUnit.Case
  use Spades.DataCase
  alias SpadesGame.{Card, GameOptions, GameUIServer, GameUI, Game}

  describe "start_link/2" do
    test "spawns a process" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
    end

    test "each name can only have one process" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
      assert {:error, _reason} = GameUIServer.start_link(game_name, options)
    end
  end

  describe "state/1" do
    test "gets state" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
      state = GameUIServer.state(game_name)
      assert %GameUI{} = state
      assert %Game{} = state.game
      assert state.game.west.hand |> Enum.member?(%Card{rank: 7, suit: :h})
      assert state.game.north.hand |> Enum.member?(%Card{rank: 2, suit: :h})
    end

    test "the hardcoded cards option provides hardcoded cards" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
      state = GameUIServer.state(game_name)
      assert state.game.west.hand |> Enum.member?(%Card{rank: 7, suit: :h})
      assert state.game.north.hand |> Enum.member?(%Card{rank: 2, suit: :h})
    end
  end

  describe "sit/3" do
    test "people can sit" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
      GameUIServer.state(game_name)
      GameUIServer.sit(game_name, 11, "west")
      GameUIServer.sit(game_name, 12, "north")
      GameUIServer.sit(game_name, 13, "east")
      state = GameUIServer.sit(game_name, 14, "south")
      assert state.seats.west == 11
      assert state.seats.north == 12
      assert state.seats.east == 13
      assert state.seats.south == 14
    end

    test "game advances status after everyone sits" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
      GameUIServer.state(game_name)
      GameUIServer.sit(game_name, 11, "west")
      GameUIServer.sit(game_name, 12, "north")
      GameUIServer.sit(game_name, 13, "east")
      GameUIServer.sit(game_name, 14, "south")
      state = GameUIServer.rewind_countdown_devtest(game_name)
      assert state.seats.west == 11
      assert state.seats.north == 12
      assert state.seats.east == 13
      assert state.seats.south == 14
      assert state.status == :playing
      assert state.game.status == :bidding
    end
  end

  describe "bid/3" do
    test "round of bidding" do
      # Get everyone playing
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
      GameUIServer.state(game_name)
      GameUIServer.sit(game_name, 11, "west")
      GameUIServer.sit(game_name, 12, "north")
      GameUIServer.sit(game_name, 13, "east")
      GameUIServer.sit(game_name, 14, "south")
      state = GameUIServer.rewind_countdown_devtest(game_name)
      assert state.seats.west == 11
      assert state.seats.north == 12
      assert state.seats.east == 13
      assert state.seats.south == 14
      assert state.status == :playing
      assert state.game.status == :bidding
      GameUIServer.bid(game_name, 13, 4)
      GameUIServer.bid(game_name, 14, 3)
      GameUIServer.bid(game_name, 11, 2)
      state = GameUIServer.bid(game_name, 12, 0)
      assert state.status == :playing
      assert state.game.status == :playing
      assert state.game.east.bid == 4
      assert state.game.south.bid == 3
      assert state.game.west.bid == 2
      assert state.game.north.bid == 0
    end
  end

  describe "play/3" do
    test "round of playing" do
      # Get everyone playing
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameUIServer.start_link(game_name, options)
      GameUIServer.state(game_name)
      GameUIServer.sit(game_name, 11, "west")
      GameUIServer.sit(game_name, 12, "north")
      GameUIServer.sit(game_name, 13, "east")
      GameUIServer.sit(game_name, 14, "south")
      state = GameUIServer.rewind_countdown_devtest(game_name)
      assert state.status == :playing
      assert state.game.status == :bidding
      GameUIServer.bid(game_name, 13, 4)
      GameUIServer.bid(game_name, 14, 3)
      GameUIServer.bid(game_name, 11, 2)
      state = GameUIServer.bid(game_name, 12, 0)
      assert state.status == :playing
      assert state.game.status == :playing
    end
  end

  defp generate_game_name do
    "game-#{:rand.uniform(1_000_000)}"
  end
end

### I Removed GameServer - The tests should be rolled into
### GameUIServer

# defmodule GameServerTest do
#   use ExUnit.Case, async: true
#   doctest SpadesGame.GameServer
#   alias SpadesGame.{GameServer, Game, GameOptions, Card}

#   describe "bid/3" do
#     test "round of bidding" do
#       game_name = generate_game_name()
#       {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

#       assert {:ok, _pid} = GameServer.start_link(game_name, options)
#       game = GameServer.state(game_name)
#       assert game.status == :bidding
#       assert {:ok, game} = GameServer.bid(game_name, :east, 3)
#       assert game.status == :bidding
#       assert {:ok, game} = GameServer.bid(game_name, :south, 4)
#       assert game.status == :bidding
#       assert {:ok, game} = GameServer.bid(game_name, :west, 2)
#       assert game.status == :bidding
#       assert {:ok, game} = GameServer.bid(game_name, :north, 0)
#       assert game.status == :playing
#       assert game.east.bid == 3
#       assert game.south.bid == 4
#       assert game.west.bid == 2
#       assert game.north.bid == 0
#       assert game.turn == :east
#     end

#     test "bid error" do
#       game_name = generate_game_name()
#       {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

#       assert {:ok, _pid} = GameServer.start_link(game_name, options)
#       game = GameServer.state(game_name)
#       assert game.status == :bidding
#       assert {:ok, game} = GameServer.bid(game_name, :east, 3)
#       assert game.status == :bidding
#       assert {:error, _msg} = GameServer.bid(game_name, :north, 0)
#     end
#   end

#   describe "play/3" do
#     test "First Trick Works" do
#       game_name = generate_game_name()
#       {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

#       assert {:ok, _pid} = GameServer.start_link(game_name, options)
#       game = GameServer.state(game_name)
#       assert game.status == :bidding

#       assert {:ok, game} = GameServer.bid(game_name, :east, 3)
#       assert {:ok, game} = GameServer.bid(game_name, :south, 4)
#       assert {:ok, game} = GameServer.bid(game_name, :west, 2)
#       assert {:ok, game} = GameServer.bid(game_name, :north, 0)
#       assert game.status == :playing

#       card_e = %Card{rank: 12, suit: :h}
#       card_s = %Card{rank: 9, suit: :h}
#       card_w = %Card{rank: 7, suit: :h}
#       card_n = %Card{rank: 2, suit: :h}

#       assert {:ok, game} = GameServer.play(game_name, :east, card_e)
#       assert {:ok, game} = GameServer.play(game_name, :south, card_s)
#       assert {:ok, game} = GameServer.play(game_name, :west, card_w)
#       assert game.trick |> length == 3
#       assert {:ok, game} = GameServer.play(game_name, :north, card_n)
#       assert game.trick |> length == 0
#       assert game.turn == :east
#       assert game.east.tricks_won == 1
#     end
#   end

# end
