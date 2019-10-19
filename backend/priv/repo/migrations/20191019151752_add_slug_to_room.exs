defmodule Spades.Repo.Migrations.AddSlugToRoom do
  use Ecto.Migration

  def change do
    alter table("rooms") do
      add(:slug, :string)
    end
  end
end
