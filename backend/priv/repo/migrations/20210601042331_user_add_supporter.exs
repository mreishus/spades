defmodule DragnCards.Repo.Migrations.UserAddSupporter do
  use Ecto.Migration

  def change do
    alter table("users") do
      add(:supporter_level, :integer)
      add(:player_back_url, :text)
      add(:encounter_back_url, :text)
      add(:background_url, :text)
    end
  end
end
