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
  newold/1:  Create a game with specified options.
  """
  @spec newold(GameOptions.t()) :: Game.t()
  def newold(%GameOptions{} = options) do
    %{
      "groups" => Groups.new(),
      "options" => options,
      "first_player" => "Player1",
      "round_number" => 0,
      "phase" => "pBeginning",
      "round_step" => "0.0",
      "player_data" => %{
        "Player1" => PlayerData.new(),
        "Player2" => PlayerData.new(),
        "Player3" => PlayerData.new(),
        "Player4" => PlayerData.new(),
      }
    }
  end

  @doc """
  new/1:  Create a game with specified options.
  """
  @spec new(GameOptions.t()) :: Game.t()
  def new(%GameOptions{} = options) do
    %{
      "groupById" => Groups.new(),
      "stackById" => %{},
      "cardById" => %{},
      "tokensById" => %{},
      "options" => options,
      "firstPlayer" => "player1",
      "roundNumber" => 0,
      "phase" => "Beginning",
      "roundStep" => "0.0",
      "playerById" => %{
        "player1" => PlayerData.new(),
        "player2" => PlayerData.new(),
        "player3" => PlayerData.new(),
        "player4" => PlayerData.new(),
      }
    }
  end

end
