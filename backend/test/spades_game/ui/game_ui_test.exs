defmodule GameUiTest do
  use ExUnit.Case, async: true

  alias SpadesGame.{GameUI, GameOptions, Card}

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
end
