defmodule GameSupervisorTest do
  use ExUnit.Case, async: true

  alias SpadesGame.{GameSupervisor, GameServer, GameOptions, Card}

  describe "start_game/1" do
    test "spawns a game server process" do
      game_name = "game-#{:rand.uniform(1000)}"
      assert {:ok, _pid} = GameSupervisor.start_game(game_name)

      via = GameServer.via_tuple(game_name)
      assert GenServer.whereis(via) |> Process.alive?()
    end

    test "returns an error if game is already started" do
      game_name = "game-#{:rand.uniform(1000)}"

      assert {:ok, pid} = GameSupervisor.start_game(game_name)
      assert {:error, {:already_started, ^pid}} = GameSupervisor.start_game(game_name)
    end
  end

  describe "start_game/2" do
    test "spawns a game server process with options" do
      game_name = "game-#{:rand.uniform(1000)}"
      {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

      assert {:ok, _pid} = GameSupervisor.start_game(game_name, options)

      via = GameServer.via_tuple(game_name)
      assert GenServer.whereis(via) |> Process.alive?()
      game = GameServer.state(game_name)
      # Test Hardcoded Cards
      assert game.west.hand |> Enum.member?(%Card{rank: 7, suit: :h})
      assert game.north.hand |> Enum.member?(%Card{rank: 2, suit: :h})
    end
  end

  describe "stop_game" do
    test "terminates the process normally" do
      game_name = "game-#{:rand.uniform(1000)}"
      {:ok, _pid} = GameSupervisor.start_game(game_name)
      via = GameServer.via_tuple(game_name)

      assert :ok = GameSupervisor.stop_game(game_name)
      refute GenServer.whereis(via)
    end
  end

  describe "ets preservation of crashed processes" do
    test "supervised game gets restarted and retains status after crashing" do
      # Start a supervised game
      game_name = "game-#{:rand.uniform(1000)}"
      {:ok, pid} = GameSupervisor.start_game(game_name)

      # discard a single card, and record the state before/after
      initial_state = GameServer.state(game_name)
      GameServer.discard(game_name)
      new_state = GameServer.state(game_name)
      assert initial_state != new_state

      # Make the game crash
      Process.exit(pid, :kaboom)
      # Give supervisor time to restart
      :timer.sleep(10)

      # Check the restored state and verify it's not the initial state
      restored_state = GameServer.state(game_name)
      assert restored_state == new_state
      assert restored_state != initial_state
    end
  end
end
