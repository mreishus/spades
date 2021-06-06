defmodule DragnCards.Repo.Migrations.UserAddPlaytester do
  use Ecto.Migration

  def change do
    alter table("users") do
      add(:playtester, :integer)
    end
  end
end
