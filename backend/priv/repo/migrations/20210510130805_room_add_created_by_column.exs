defmodule DragnCards.Repo.Migrations.RoomAddCreatedByColumn do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add(:created_by, :integer, null: false)
    end
  end
end
