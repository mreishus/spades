defmodule SpadesGame.Tokens do
  @moduledoc """
  Tokens on a card.
  """
  alias SpadesGame.Tokens

  @type t :: Map.t()

  @spec new() :: Map.t()
  def new() do
    %{"resource"=> 1,
      "progress"=> 0,
      "damage"=> 0,
      "time"=> 0,
      "threat"=> 1,
      "willpower"=> -1,
      "attack"=> 0,
      "defense"=> 0,
    }
  end
end
