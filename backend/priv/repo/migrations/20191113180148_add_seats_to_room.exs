defmodule Spades.Repo.Migrations.AddSeatsToRoom do
  use Ecto.Migration

  def change do
    alter table("rooms") do
      add(:east, :integer, null: true)
      add(:west, :integer, null: true)
      add(:north, :integer, null: true)
      add(:south, :integer, null: true)
    end
  end
end
