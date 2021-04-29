defmodule DragnCards.Repo.Migrations.MakeUserAliasUnique do
  use Ecto.Migration

  def change do
    create(unique_index(:users, [:alias]))
  end
end
