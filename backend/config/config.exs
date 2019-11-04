# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :spades,
  ecto_repos: [Spades.Repo]

config :spades, :pow,
  user: Spades.Users.User,
  repo: Spades.Repo,
  extensions: [PowEmailConfirmation, PowResetPassword],
  controller_callbacks: Pow.Extension.Phoenix.ControllerCallbacks,
  mailer_backend: SpadesWeb.PowMailer,
  cache_store_backend: Pow.Store.Backend.MnesiaCache

# Configures the endpoint
config :spades, SpadesWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "8fqaEQYF++61y9MByi3t+TE2+VGFuEQFfhrlBkzliKpM+1Vi5roQ3arQHNk7uRwi",
  render_errors: [view: SpadesWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Spades.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
