defmodule DragnCards.Snapshot do
  use Ecto.Schema

  schema "snapshots" do
    field :user, :integer
    field :encounter, :string
    field :round, :string
    field :num_players, :integer
    field :player1_heroes, :string
    field :player3_heroes, :string
    field :player2_heroes, :string
    field :player4_heroes, :string
    field :game_json, :string

    timestamps()
  end
end
