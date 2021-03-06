defmodule SpadesGame.Game do
  @moduledoc """
  Represents a game of spades.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  """
  alias SpadesGame.{Groups, Game, GameOptions, PlayerData}

  @type t :: Map.t()

  @doc """
  new/1:  Create a game with default options.
  """
  @spec new() :: Game.t()
  def new() do
    {:ok, options} = GameOptions.validate(%{})
    new(options)
  end

  @doc """
  new/1:  Create a game with specified options.
  """
  @spec new(GameOptions.t()) :: Game.t()
  def new(%GameOptions{} = options) do
    %{
      "options" => options,
      "firstPlayer" => "player1",
      "roundNumber" => 0,
      "phase" => "Beginning",
      "roundStep" => "0.0",

      "groupById" => Groups.new(),
      "stackById" => %{},
      "cardById"  => %{},
      "tokensById" => %{},
      "playerById" => %{
        "player1" => PlayerData.new(),
        "player2" => PlayerData.new(),
        "player3" => PlayerData.new(),
        "player4" => PlayerData.new(),
      }
    }
  end

end
