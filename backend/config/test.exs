use Mix.Config

config :spades, :pow,
  user: Spades.Users.User,
  repo: Spades.Repo

# Configure your database
config :spades, Spades.Repo,
  username: "postgres",
  password: "postgres",
  database: "spades_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :spades, SpadesWeb.Endpoint,
  http: [port: 4002],
  server: false,
  front_end_email_confirm_url: "http://localhost:3000/confirm-email/{token}"

# Print only warnings and errors during test
config :logger, level: :warn
