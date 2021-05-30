defmodule DragnCards.Repo.Migrations.CreateReplays do
  use Ecto.Migration

  def change do
    create table(:replays) do
      add(:user, :integer, null: false)
      add(:uuid, :string, null: false)
      add(:encounter, :string)
      add(:rounds, :integer)
      add(:num_players, :integer)
      add(:player1_heroes, {:array, :string})
      add(:player3_heroes, {:array, :string})
      add(:player2_heroes, {:array, :string})
      add(:player4_heroes, {:array, :string})
      add(:game_json, :map, null: false)

      timestamps()
    end
  end
end
