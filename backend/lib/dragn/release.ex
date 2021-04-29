defmodule DragnCards.Release do
  @moduledoc """
  Helper for running Migrations after deployed by release.
  See https://hexdocs.pm/phoenix/releases.html for more info.

  ./start.sh allows us to run `./bin/dragncards eval "DragnCards.Release.migrate"` when
  starting the app up.
  """
  @app :dragncards

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    load_app()
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  defp repos do
    Application.fetch_env!(@app, :ecto_repos)
  end

  defp load_app do
    Application.load(@app)
  end
end
