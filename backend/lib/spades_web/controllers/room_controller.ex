defmodule SpadesWeb.RoomController do
  use SpadesWeb, :controller

  alias Spades.Rooms
  alias Spades.Rooms.Room
  alias SpadesWeb.Endpoint

  action_fallback SpadesWeb.FallbackController

  def index(conn, _params) do
    rooms = Rooms.list_rooms()
    render(conn, "index.json", rooms: rooms)
  end

  def create(conn, %{"room" => room_params}) do
    with {:ok, %Room{} = room} <- Rooms.create_room(room_params) do
      notify_lobby()

      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.room_path(conn, :show, room))
      |> render("show.json", room: room)
    end
  end

  def show(conn, %{"id" => id}) do
    room = Rooms.get_room!(id)
    render(conn, "show.json", room: room)
  end

  def update(conn, %{"id" => id, "room" => room_params}) do
    room = Rooms.get_room!(id)

    with {:ok, %Room{} = room} <- Rooms.update_room(room, room_params) do
      notify_lobby()
      render(conn, "show.json", room: room)
    end
  end

  def delete(conn, %{"id" => id}) do
    room = Rooms.get_room!(id)

    with {:ok, %Room{}} <- Rooms.delete_room(room) do
      notify_lobby()
      send_resp(conn, :no_content, "")
    end
  end

  defp notify_lobby do
    Endpoint.broadcast!("lobby:lobby", "notify_update", %{})
  end
end
