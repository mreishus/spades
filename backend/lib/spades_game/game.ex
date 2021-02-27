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
      "groups" => Groups.new(),
      "options" => options,
      "first_player" => "Player1",
      "round_number" => 1,
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

end
