defmodule GameUiServerTest do
  use ExUnit.Case, async: true
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
  end

  defp generate_game_name do
    "game-#{:rand.uniform(1_000_000)}"
  end
end
