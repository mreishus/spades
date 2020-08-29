defmodule Spades.Rooms.Room do
  @moduledoc """
  Represents a room where people join and play a game.
  """
  use Ecto.Schema
  import Ecto.Changeset
  alias SpadesUtil.Slugify

  # Automatically convert to JSON when broadcasting %Room{}
  # Objects over channel messages
  @derive {Jason.Encoder, only: [:id, :name, :slug, :player1, :player2, :player3, :player4]}

  schema "rooms" do
    field :name, :string
    field :slug, :string
    field :player1, :integer
    field :player2, :integer
    field :player3, :integer
    field :player4, :integer

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:name, :player1, :player2, :player3, :player4])
    |> validate_required([:name])
    |> put_slug()
  end

  def put_slug(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{name: name}} ->
        put_change(changeset, :slug, Slugify.slugify(name))

      _ ->
        changeset
    end
  end
end
