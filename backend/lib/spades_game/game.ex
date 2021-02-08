defmodule SpadesGame.Game do
  @moduledoc """
  Represents a game of spades.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  """
  alias SpadesGame.{Groups, Game, GameOptions, Player}

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
  new/2:  Create a game with specified options.
  """
  @spec new(GameOptions.t()) :: Game.t()
  def new(%GameOptions{} = options) do
    %{
      "groups" => Groups.new(),
      "options" => options,
      "first_player" => 1,
      "round_number" => 1,
      "phase" => "roundstart",
      "phasepart" => "beginning",
    }
  end

end
