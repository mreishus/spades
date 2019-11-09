defmodule SpadesGame.GameScoreRoundTeam do
  @moduledoc """
  Represents one round of scoring for one team.
  """

  alias SpadesGame.{GamePlayer, GameScoreRoundTeam}

  @derive Jason.Encoder
  defstruct [
    # Score of the team going into the round
    :before_score,
    # # of bags the team had going into the round
    :before_bags,
    # What the team bid.
    :bid,
    # How many tricks they won.
    :won,
    # How many points they gained from a successful bid, or nil if N/A.
    :adj_successful_bid,
    # How many points they lost from a missed bid, or nil if N/A.
    :adj_failed_bid,
    # How many bags they gained this round, or nil if not computed yet.
    :adj_bags,
    # Penalty if bags went over 10, either -100 or 0
    :bag_penalty,
    # Score of the team after the round, or nil if not computed.
    :after_score,
    # Bags of the team after the round, or nil if not computed.
    :after_bags
  ]

  use Accessible

  @type t :: %GameScoreRoundTeam{
          before_score: integer(),
          before_bags: integer(),
          bid: non_neg_integer(),
          won: non_neg_integer(),
          adj_successful_bid: nil | integer(),
          adj_failed_bid: nil | integer(),
          adj_bags: integer(),
          bag_penalty: integer(),
          after_score: integer(),
          after_bags: integer()
        }

  @spec new(integer, integer, GamePlayer.t(), GamePlayer.t()) :: GameScoreRoundTeam.t()
  def new(before_score, before_bags, player1, player2) do
    ## If player1 or player2 hasn't bid yet (=nil), error

    adj_successful_bid = successful_bid(player1, player2)
    adj_failed_bid = failed_bid(player1, player2)
    adj_bags = adj_bags(player1, player2)
    {after_bags, bag_penalty} = increment_bags(before_bags, adj_bags)

    %GameScoreRoundTeam{
      before_score: before_score,
      before_bags: before_bags,
      bid: player1.bid + player2.bid,
      won: player1.tricks_won + player2.tricks_won,
      adj_successful_bid: adj_successful_bid,
      adj_failed_bid: adj_failed_bid,
      adj_bags: adj_bags,
      bag_penalty: bag_penalty,
      after_score:
        before_score + (adj_successful_bid || 0) + (adj_failed_bid || 0) + adj_bags + bag_penalty,
      after_bags: after_bags
    }
  end

  @doc """
  successful_bid/2:
  """
  @spec successful_bid(GamePlayer.t(), GamePlayer.t()) :: nil | integer()
  def successful_bid(player1, player2) do
    won = player1.tricks_won + player2.tricks_won
    bid = player1.bid + player2.bid

    if won >= bid do
      10 * bid
    else
      nil
    end
  end

  @doc """
  failed_bid/2:
  """
  @spec failed_bid(GamePlayer.t(), GamePlayer.t()) :: nil | integer()
  def failed_bid(player1, player2) do
    won = player1.tricks_won + player2.tricks_won
    bid = player1.bid + player2.bid

    if won < bid do
      -10 * bid
    else
      nil
    end
  end

  @doc """
  adj_bags/2
  """
  @spec adj_bags(GamePlayer.t(), GamePlayer.t()) :: nil | integer()
  def adj_bags(player1, player2) do
    won = player1.tricks_won + player2.tricks_won
    bid = player1.bid + player2.bid

    if won > bid do
      won - bid
    else
      0
    end
  end

  def increment_bags(before_bags, adj_bags) do
    after_bags = before_bags + adj_bags
    do_increment_bags(after_bags, 0)
  end

  def do_increment_bags(after_bags, bag_penalty) when after_bags < 10 do
    {after_bags, bag_penalty}
  end

  def do_increment_bags(after_bags, bag_penalty) when after_bags >= 10 do
    do_increment_bags(after_bags - 10, bag_penalty - 100)
  end
end
