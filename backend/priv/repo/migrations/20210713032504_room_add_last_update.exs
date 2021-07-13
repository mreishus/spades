defmodule DragnCards.Repo.Migrations.RoomAddLastUpdate do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add(:last_update, :integer)
    end
  end
end
