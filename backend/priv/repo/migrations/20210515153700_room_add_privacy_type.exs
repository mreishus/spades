defmodule DragnCards.Repo.Migrations.RoomAddPrivacyType do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add(:privacy_type, :string, null: false)
    end
  end
end
