defmodule DragnCardsGame.Tokens do
  @moduledoc """
  Tokens on a card.
  """

  @type t :: Map.t()

  @spec new() :: Map.t()
  def new() do
    %{
      "resource"=> 0,
      "progress"=> 0,
      "damage"=> 0,
      "time"=> 0,
      "threat"=> 0,
      "willpower"=> 0,
      "attack"=> 0,
      "defense"=> 0,
      "hitPoints"=> 0,
    }
  end
end
