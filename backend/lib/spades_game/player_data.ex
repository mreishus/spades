defmodule SpadesGame.PlayerData do
  @moduledoc """
  Represents a player.
  """
  alias SpadesGame.{PlayerData}

  @type t :: Map.t()

  @doc """
  new/1:  Create a player.
  """
  @spec new() :: PlayerData.t()
  def new() do
    %{
      "threat" => 0,
      "willpower" => 0,
      "eliminated" => false,
      "cards_drawn_during_resource" => 1,
    }
  end

end
