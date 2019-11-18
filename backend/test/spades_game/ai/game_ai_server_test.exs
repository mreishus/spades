defmodule GameAiServerTest do
  use ExUnit.Case, async: true

  alias SpadesGame.{GameAIServer}

  describe "start_link/2" do
    test "spawns a process" do
      game_name = generate_game_name()

      assert {:ok, _pid} = GameAIServer.start_link(game_name)
    end

    test "each name can only have one process" do
      game_name = generate_game_name()

      assert {:ok, _pid} = GameAIServer.start_link(game_name)
      assert {:error, _reason} = GameAIServer.start_link(game_name)
    end
  end

  describe "state/1" do
    test "gets state" do
      game_name = generate_game_name()

      assert {:ok, _pid} = GameAIServer.start_link(game_name)
      state = GameAIServer.state(game_name)
      assert %{} = state
    end
  end

  defp generate_game_name do
    "game-#{:rand.uniform(1_000_000)}"
  end
end
