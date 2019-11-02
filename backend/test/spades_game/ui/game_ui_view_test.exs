defmodule GameUiViewTest do
  use ExUnit.Case, async: true

  alias SpadesGame.{GameUI, GameUIView, GameOptions}

  setup do
    game_name = "game-#{:rand.uniform(1000)}"
    {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})

    gameui = GameUI.new(game_name, options)
    %{gameui: gameui}
  end

  describe "view_for/2" do
    test "works", %{gameui: gameui} do
      gameui = GameUI.sit(gameui, 10, "north")
      gameui = GameUI.sit(gameui, 11, "east")
      gameui = GameUI.sit(gameui, 12, "west")
      gameui = GameUI.sit(gameui, 13, "south")

      ## Hands hidden while staging
      north_view = GameUIView.view_for(gameui, 10)
      east_view = GameUIView.view_for(gameui, 11)
      west_view = GameUIView.view_for(gameui, 12)
      south_view = GameUIView.view_for(gameui, 13)

      assert north_view.my_hand == []
      assert south_view.my_hand == []
      assert east_view.my_hand == []
      assert west_view.my_hand == []

      ## Hands not hidden while playing
      gameui = %GameUI{gameui | status: :playing}

      north_view = GameUIView.view_for(gameui, 10)
      east_view = GameUIView.view_for(gameui, 11)
      west_view = GameUIView.view_for(gameui, 12)
      south_view = GameUIView.view_for(gameui, 13)

      assert north_view.my_hand == gameui.game.north.hand
      assert south_view.my_hand == gameui.game.south.hand
      assert east_view.my_hand == gameui.game.east.hand
      assert west_view.my_hand == gameui.game.west.hand

      assert north_view.game_ui.game.south.hand == []
      assert north_view.game_ui.game.north.hand == []
      assert north_view.game_ui.game.east.hand == []
      assert north_view.game_ui.game.west.hand == []
    end
  end
end
