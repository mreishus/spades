defmodule DragnCards.Repo do
  use Ecto.Repo,
    otp_app: :dragncards,
    adapter: Ecto.Adapters.Postgres
end
