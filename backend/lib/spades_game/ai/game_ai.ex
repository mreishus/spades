defmodule SpadesGame.GameAI do
  @moduledoc """
  ...
  """
  alias SpadesGame.{Card, GameUI, Game}
  alias SpadesGame.GameAI.Bid

  # partner(:north) = :south
  # partner(:west) = :east
  # etc
  @spec partner(:north | :east | :west | :south) :: :north | :east | :west | :south
  def partner(seat) do
    seat
    |> Game.rotate()
    |> Game.rotate()
  end

  def bid_amount(%GameUI{game: game} = _game_ui) do
    # "Need to bid" |> IO.inspect()
    hand = game[game.turn].hand
    partner_bid = game[partner(game.turn)].bid

    Bid.bid(hand, partner_bid)
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

  def example_hand() do
    [
      %Card{rank: 2, suit: :h},
      %Card{rank: 3, suit: :d},
      %Card{rank: 14, suit: :h},
      %Card{rank: 14, suit: :c},
      %Card{rank: 3, suit: :s},
      %Card{rank: 9, suit: :c},
      %Card{rank: 10, suit: :s},
      %Card{rank: 11, suit: :c},
      %Card{rank: 6, suit: :c},
      %Card{rank: 13, suit: :c},
      %Card{rank: 12, suit: :d},
      %Card{rank: 8, suit: :s},
      %Card{rank: 4, suit: :h}
    ]
  end
end
