defmodule DragnCardsGame.Game do
  @moduledoc """
  Represents a game of dragncards.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  """
  alias DragnCardsGame.{Groups, Game, PlayerData}

  @type t :: Map.t()

  @doc """
  new/1:  Create a game with specified options.
  """
  @spec new(Map.t()) :: Game.t()
  def new(%{} = options) do
    IO.puts("game new")
    game = %{
      "version" => 0.1,
      "options" => options,
      "numPlayers" => 1,
      "layout" => "standard",
      "firstPlayer" => "player1",
      "roundNumber" => 0,
      "phase" => "Beginning",
      "roundStep" => "0.0",
      "groupById" => Groups.new(),
      "stackById" => %{},
      "cardById"  => %{},
      "triggerMap" => %{},
      "playerData" => %{
        "player1" => PlayerData.new(),
        "player2" => PlayerData.new(),
        "player3" => PlayerData.new(),
        "player4" => PlayerData.new(),
      }
    }
    IO.inspect(game)
    game
  end

end
