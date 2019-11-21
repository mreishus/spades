defmodule SpadesGame.GameAI do
  @moduledoc """
  ...
  """
  alias SpadesGame.{Card, GameUI, Game}
  alias SpadesGame.GameAI.{Bid, Play}

  @spec bid_amount(GameUI.t()) :: integer
  def bid_amount(%GameUI{game: game} = _game_ui) do
    # "Need to bid" |> IO.inspect()

    # hand = game[game.turn].hand  # Old way
    # New way
    hand = Game.hand(game, game.turn)

    partner_bid = game[partner(game.turn)].bid

    Bid.bid(hand, partner_bid)
  end

  @spec play_card(GameUI.t()) :: Card.t()
  def play_card(%GameUI{game: game} = _game_ui) do
    Play.play(game)
  end

  def waiting_bot_bid?(%GameUI{game: game} = game_ui) do
    GameUI.bot_turn?(game_ui) and game.status == :bidding
  end

  def waiting_bot_play?(%GameUI{game: game} = game_ui) do
    GameUI.bot_turn?(game_ui) and game.status == :playing
  end

  # partner(:north) = :south
  # partner(:west) = :east
  # etc
  @spec partner(:north | :east | :west | :south) :: :north | :east | :west | :south
  def partner(seat) do
    seat
    |> Game.rotate()
    |> Game.rotate()
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
