defmodule SpadesWeb.Router do
  use SpadesWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
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
  end
end
