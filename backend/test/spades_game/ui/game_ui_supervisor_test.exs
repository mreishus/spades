defmodule GameUISupervisorTest do
  use ExUnit.Case
  use Spades.DataCase
  doctest SpadesGame.GameUISupervisor

  alias SpadesGame.{GameUISupervisor, GameUIServer, GameOptions}

  defp default_options do
    %GameOptions{}
  end

  describe "start_game" do
    test "spawns a game server process" do
      game_name = "game-#{:rand.uniform(1000)}"
      assert {:ok, _pid} = GameUISupervisor.start_game(game_name, default_options())

      via = GameUIServer.via_tuple(game_name)
      assert GenServer.whereis(via) |> Process.alive?()
    end

    test "returns an error if game is already started" do
      game_name = "game-#{:rand.uniform(1000)}"

      assert {:ok, pid} = GameUISupervisor.start_game(game_name, default_options())

      assert {:error, {:already_started, ^pid}} =
               GameUISupervisor.start_game(game_name, default_options())
    end
  end

  describe "stop_game" do
    test "terminates the process normally" do
      game_name = "game-#{:rand.uniform(1000)}"
      {:ok, _pid} = GameUISupervisor.start_game(game_name, default_options())
      via = GameUIServer.via_tuple(game_name)

      assert :ok = GameUISupervisor.stop_game(game_name)
      refute GenServer.whereis(via)
    end
  end

  describe "ets preservation of crashed processes" do
    test "supervised game gets restarted and retains status after crashing" do
      # Start a supervised game
      game_name = "game-#{:rand.uniform(1000)}"
      {:ok, pid} = GameUISupervisor.start_game(game_name, default_options())

      # have a few people sit, and record the state before/after
      initial_state = GameUIServer.state(game_name)
      GameUIServer.sit(game_name, 11, "west")
      GameUIServer.sit(game_name, 12, "north")
      GameUIServer.sit(game_name, 13, "east")
      new_state = GameUIServer.state(game_name)
      assert initial_state != new_state

      # Make the game crash
      Process.exit(pid, :kaboom)
      # Give supervisor time to restart
      :timer.sleep(10)

      # # Check the restored state and verify it's not the initial state
      restored_state = GameUIServer.state(game_name)
      assert restored_state == new_state
      assert restored_state != initial_state
    end
  end
end
