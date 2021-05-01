defmodule DragnCards.Repo.Migrations.CreateSnapshots do
  use Ecto.Migration

  def change do
    create table(:snapshots) do
      add(:user, :integer, null: false)
      add(:encounter, :string)
      add(:round, :string)
      add(:num_players, :integer)
      add(:player1_heroes, :string)
      add(:player3_heroes, :string)
      add(:player2_heroes, :string)
      add(:player4_heroes, :string)
      add(:game_json, :string, null: false)

      timestamps()
    end
  end
end
