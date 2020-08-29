defmodule Spades.Repo.Migrations.AddSeatsToRoom do
  use Ecto.Migration

  def change do
    alter table("rooms") do
      add(:player1, :integer, null: true)
      add(:player2, :integer, null: true)
      add(:player3, :integer, null: true)
      add(:player4, :integer, null: true)
    end
  end
end
