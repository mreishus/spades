defmodule GameAiTest do
  use ExUnit.Case, async: true

  alias SpadesGame.{Game, GameAI, GameUI, GameOptions}

  setup do
    # {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})
    {:ok, options} = GameOptions.validate(%{})
    %{options: options}
  end

  describe "AI Bid+Play" do
    test "Play an entire game", %{options: options} do
      game_name = "game ai test"

      game_ui =
        GameUI.new(game_name, options)
        |> GameUI.invite_bots()

      # Let them play up to 25 rounds and see if there's a winner
      # Usually they don't need this many, but sometimes they
      # get a lot of bags.. 
      #
      # A possible test of the AI quality is how many rounds they 
      # need to finish a game.
      game_ui =
        1..25
        |> Enum.to_list()
        |> Enum.reduce(game_ui, fn _, game_ui ->
          bid_and_play_round(game_ui)
        end)

      assert game_ui.game.winner != nil
    end
  end

  # def bid_and_play_round(%GameUI{status: :done} = game_ui), do: game_ui
  def bid_and_play_round(%GameUI{game: %{winner: winner}} = game_ui) when winner != nil,
    do: game_ui

  def bid_and_play_round(game_ui) do
    old_score_n = game_ui.game.score.north_south_score
    old_score_e = game_ui.game.score.east_west_score
    assert game_ui.game.status == :bidding

    game_ui = bid_round(game_ui)
    assert game_ui.game.status == :playing

    game_ui = play_round(game_ui)
    assert game_ui.game.winner != nil or game_ui.game.status == :bidding
    new_score_n = game_ui.game.score.north_south_score
    new_score_e = game_ui.game.score.east_west_score
    assert old_score_n != new_score_n
    assert old_score_e != new_score_e
    # %{new_score_e: new_score_e, new_score_n: new_score_n} |> IO.inspect()
    game_ui
  end

  def bid_round(game_ui) do
    1..4
    |> Enum.to_list()
    |> Enum.reduce(game_ui, fn _, game_ui ->
      bid_amount = GameAI.bid_amount(game_ui)
      GameUI.bid(game_ui, :bot, bid_amount)
    end)
  end

  def play_round(game_ui) do
    1..52
    |> Enum.to_list()
    |> Enum.reduce(game_ui, fn _, game_ui ->
      card = GameAI.play_card(game_ui)
      game_ui = GameUI.play(game_ui, :bot, card)
      %GameUI{game_ui | game: Game.rewind_trickfull_devtest(game_ui.game)}
    end)
  end
end
