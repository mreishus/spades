defmodule GameScoreRoundTeamTest do
  use ExUnit.Case, async: true
  alias DragnCardsGame.{GameScoreRoundTeam, GamePlayer}

  describe "simple bidding" do
    test "met bid exactly" do
      player1 = player(3, 3)
      player2 = player(3, 3)

      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.bid == 6
      assert gsrt.won == 6
      assert gsrt.adj_successful_bid == 60
      assert gsrt.adj_failed_bid == 0
      assert gsrt.after_score == 60
    end

    test "met bid exactly, as a team" do
      player1 = player(4, 2)
      player2 = player(2, 4)

      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.bid == 6
      assert gsrt.won == 6
      assert gsrt.adj_successful_bid == 60
      assert gsrt.adj_failed_bid == 0
      assert gsrt.after_score == 60
    end

    test "missed bid" do
      player1 = player(3, 3)
      player2 = player(3, 2)

      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.bid == 6
      assert gsrt.won == 5
      assert gsrt.adj_successful_bid == 0
      assert gsrt.adj_failed_bid == -60
      assert gsrt.after_score == -60
    end
  end

  describe "nil" do
    test "player1 successful nil" do
      player1 = player(0, 0)
      player2 = player(2, 2)
      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.bid == 2
      assert gsrt.won == 2
      assert gsrt.adj_successful_nil == 100
      assert gsrt.adj_failed_nil == 0
      assert gsrt.after_score == 120
    end

    test "both players nil (lol)" do
      player1 = player(0, 0)
      player2 = player(0, 0)
      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.bid == 0
      assert gsrt.won == 0
      assert gsrt.adj_successful_nil == 200
      assert gsrt.adj_failed_nil == 0
      assert gsrt.after_score == 200
    end

    test "failed nil" do
      player1 = player(0, 1)
      player2 = player(2, 2)
      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.bid == 2
      assert gsrt.won == 3
      assert gsrt.adj_successful_nil == 0
      assert gsrt.adj_failed_nil == -100
      assert gsrt.after_score == -79
    end

    test "regular round has no nil scores" do
      player1 = player(3, 3)
      player2 = player(3, 2)

      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.adj_successful_nil == 0
      assert gsrt.adj_failed_nil == 0
    end
  end

  describe "sandbags" do
    test "going one over adds a bag" do
      player1 = player(4, 4)
      player2 = player(2, 3)

      gsrt = GameScoreRoundTeam.new(0, 0, player1, player2)
      assert gsrt.bid == 6
      assert gsrt.won == 7
      assert gsrt.adj_successful_bid == 60
      assert gsrt.adj_failed_bid == 0
      assert gsrt.after_bags == 1
      assert gsrt.after_score == 61
    end

    test "bags and score accumulate" do
      player1 = player(4, 4)
      player2 = player(2, 3)

      gsrt = GameScoreRoundTeam.new(55, 5, player1, player2)
      assert gsrt.bid == 6
      assert gsrt.won == 7
      assert gsrt.adj_successful_bid == 60
      assert gsrt.adj_failed_bid == 0
      assert gsrt.after_bags == 6
      assert gsrt.after_score == 116
    end

    test "going over 10 bags is a 100 point penalty" do
      player1 = player(4, 4)
      player2 = player(2, 4)

      gsrt = GameScoreRoundTeam.new(59, 9, player1, player2)
      assert gsrt.bid == 6
      assert gsrt.won == 8
      assert gsrt.adj_successful_bid == 60
      assert gsrt.adj_failed_bid == 0
      assert gsrt.bag_penalty == -100
      assert gsrt.after_bags == 1
      assert gsrt.after_score == 21
    end
  end

  defp player(bid, won) do
    %GamePlayer{
      hand: [],
      tricks_won: won,
      bid: bid
    }
  end
end
