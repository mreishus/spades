defmodule SpadesWeb.Router do
  use SpadesWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    #   plug Pow.Plug.Session, otp_app: :spades # If we want HTML Frontend Auth
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug SpadesWeb.APIAuthPlug, otp_app: :spades
  end

  pipeline :api_protected do
    plug Pow.Plug.RequireAuthenticated, error_handler: SpadesWeb.APIAuthErrorHandler
  end

  scope "/", SpadesWeb do
    pipe_through :browser

    get "/json_test", PageController, :json_test
    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", SpadesWeb do
    pipe_through :api
    resources "/rooms", RoomController, except: [:new, :edit]
    get "/authtest", RoomController, :authtest
  end

  scope "/api/v1", SpadesWeb.API.V1, as: :api_v1 do
    pipe_through :api

    resources "/registration", RegistrationController, singleton: true, only: [:create]
    resources "/session", SessionController, singleton: true, only: [:create, :delete]
    post "/session/renew", SessionController, :renew

    resources "/confirm-email", ConfirmationController, only: [:show]
  end

  scope "/api/v1", SpadesWeb.API.V1, as: :api_v1 do
    pipe_through [:api, :api_protected]

    # Your protected API endpoints here
  end
end
