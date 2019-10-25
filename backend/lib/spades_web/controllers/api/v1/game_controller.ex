defmodule SpadesWeb.API.V1.GameController do
  use SpadesWeb, :controller

  require Logger

  alias Spades.Rooms
  alias Spades.Rooms.Room
  alias SpadesUtil.{NameGenerator}
  alias SpadesGame.{GameOptions, GameUISupervisor}

  def create(conn, _params) do
    game_name = NameGenerator.generate()
    options = %GameOptions{}

    with {:ok, _pid} <- GameUISupervisor.start_game(game_name, options),
         %Room{} = room <- Rooms.get_room_by_name(game_name) do
      conn
      |> put_status(:created)
      |> json(%{success: %{message: "Created game", room: room}})
    else
      _ ->
        conn
        |> put_status(500)
        |> json(%{error: %{status: 500, message: "Unable to create game"}})
    end
  end
end
