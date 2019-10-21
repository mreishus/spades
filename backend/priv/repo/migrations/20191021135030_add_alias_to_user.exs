defmodule Spades.Repo.Migrations.AddAliasToUser do
  use Ecto.Migration

  def change do
    alter table("users") do
      add(:alias, :string)
    end
  end
end
