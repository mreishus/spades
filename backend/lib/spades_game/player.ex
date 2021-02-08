defmodule SpadesGame.Player do
  @moduledoc """
  Represents a player.
  """
  alias SpadesGame.{Player}

  @type t :: Map.t()

  @doc """
  new/1:  Create a player.
  """
  @spec new() :: Player.t()
  def new() do
    %{
      "username" => "",
      "threat" => 0,
      "willpower" => 0,
      "user_id" => nil,
    }
  end

end
