defmodule SpadesGame.GameAI do
  @moduledoc """
  ...
  """
  alias SpadesGame.{GameUI, Game}

  def bid_amount(%GameUI{game: _game} = _game_ui) do
    3
  end

  def play_card(%GameUI{game: %Game{turn: turn} = game} = _game_ui) do
    {:ok, hand} = Game.valid_cards(game, turn)
    hand |> Enum.random()
  end

  def waiting_bot_bid?(%GameUI{game: game} = game_ui) do
    GameUI.bot_turn?(game_ui) and game.status == :bidding
  end

  def waiting_bot_play?(%GameUI{game: game} = game_ui) do
    GameUI.bot_turn?(game_ui) and game.status == :playing
  end
end
