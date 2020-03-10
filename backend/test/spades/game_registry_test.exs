defmodule Spades.GameRegistryTest do
  use Spades.DataCase
  alias Spades.Rooms
  alias Spades.Rooms.Room
  alias SpadesGame.{GameOptions, GameUI, GameRegistry}

  # use ExUnit.Case

  setup do
    game_name = "game-#{:rand.uniform(1000)}"
    {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

    game_ui = GameUI.new(game_name, options)
    %{game_ui: game_ui}
  end

  describe "add/0" do
    test "works", %{game_ui: game_ui} do
      game_ui = GameUI.sit(game_ui, 10, "north")
      name = game_ui.game_name
      GameRegistry.add(name, game_ui)
      room = Rooms.get_room_by_name(name)
      assert %Room{} = room
      assert room.name == name
    end
  end
end
