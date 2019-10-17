defmodule GameServerTest do
  use ExUnit.Case, async: true
  doctest SpadesGame.GameServer
  alias SpadesGame.{GameServer, Game}

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

  describe "state/1" do
    test "get game state" do
      game_name = generate_game_name()
      assert {:ok, _pid} = GameServer.start_link(game_name)
      state = GameServer.state(game_name)
      assert %Game{} = state
      assert state.draw |> length == 52
    end
  end

  defp generate_game_name do
    "game-#{:rand.uniform(1_000_000)}"
  end
end
