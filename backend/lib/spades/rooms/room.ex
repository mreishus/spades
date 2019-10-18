defmodule Spades.Rooms.Room do
  @moduledoc """
  Represents a room where people join and play a game.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "rooms" do
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
