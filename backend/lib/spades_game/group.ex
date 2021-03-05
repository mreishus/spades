defmodule SpadesGame.Group do
  @moduledoc """
  Represents a player inside a game of spades.
  They will have a hand of cards, a bid etc.
  """
  alias SpadesGame.{Group,Stack}

  @type t :: Map.t()

  @doc """
  new/3: Create a new group.
  """
  @spec new(String.t(), String.t(), String.t()) :: Map.t()
  def new(id, type, controller) do
    %{
      "id"=> id,
      "type"=> type,
      "controller"=> controller,
      #"stacks"=> []
    }
  end

  @doc """
  empty/1: Empty the group.
  """
  @spec empty(Group.t()) :: Map.t()
  def empty(group) do
    %{group | "stacks"=> []}
  end

end
