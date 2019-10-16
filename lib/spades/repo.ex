defmodule Spades.Repo do
  use Ecto.Repo,
    otp_app: :spades,
    adapter: Ecto.Adapters.Postgres
end
