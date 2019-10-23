defmodule GameServerTest do
  use ExUnit.Case, async: true
  doctest SpadesGame.GameServer
  alias SpadesGame.{GameServer, Game, GameOptions, Card}

  describe "start_link/1" do
    test "spawns a process" do
      game_name = generate_game_name()

      assert {:ok, _pid} = GameServer.start_link(game_name)
    end

    test "each name can only have one process" do
      game_name = generate_game_name()

      assert {:ok, _pid} = GameServer.start_link(game_name)
      assert {:error, _reason} = GameServer.start_link(game_name)
    end
  end

  describe "start_link/2" do
    test "spawns a process" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameServer.start_link(game_name, options)
    end

    test "each name can only have one process" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameServer.start_link(game_name, options)
      assert {:error, _reason} = GameServer.start_link(game_name, options)
    end

    test "the hardcoded cards option provides hardcoded cards" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameServer.start_link(game_name, options)
      game = GameServer.state(game_name)
      assert game.west.hand |> Enum.member?(%Card{rank: 7, suit: :h})
      assert game.north.hand |> Enum.member?(%Card{rank: 2, suit: :h})
    end
  end

  describe "state/1" do
    test "get game state" do
      game_name = generate_game_name()
      assert {:ok, _pid} = GameServer.start_link(game_name)
      state = GameServer.state(game_name)
      assert %Game{} = state
      assert state.draw |> length == 52
    end
  end

  describe "discard/1" do
    test "discard discards a card" do
      game_name = generate_game_name()
      assert {:ok, _pid} = GameServer.start_link(game_name)
      state = GameServer.state(game_name)
      assert %Game{} = state
      assert state.draw |> length == 52

      state2 = GameServer.discard(game_name)
      assert %Game{} = state2
      assert state2.draw |> length == 51
    end
  end

  describe "bid/3" do
    test "round of bidding" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameServer.start_link(game_name, options)
      game = GameServer.state(game_name)
      assert game.status == :bidding
      assert {:ok, game} = GameServer.bid(game_name, :east, 3)
      assert game.status == :bidding
      assert {:ok, game} = GameServer.bid(game_name, :south, 4)
      assert game.status == :bidding
      assert {:ok, game} = GameServer.bid(game_name, :west, 2)
      assert game.status == :bidding
      assert {:ok, game} = GameServer.bid(game_name, :north, 0)
      assert game.status == :playing
      assert game.east.bid == 3
      assert game.south.bid == 4
      assert game.west.bid == 2
      assert game.north.bid == 0
      assert game.turn == :east
    end

    test "bid error" do
      game_name = generate_game_name()
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameServer.start_link(game_name, options)
      game = GameServer.state(game_name)
      assert game.status == :bidding
      assert {:ok, game} = GameServer.bid(game_name, :east, 3)
      assert game.status == :bidding
      assert {:error, _msg} = GameServer.bid(game_name, :north, 0)
    end
  end

  defp generate_game_name do
    "game-#{:rand.uniform(1_000_000)}"
  end
end
