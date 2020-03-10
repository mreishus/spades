defmodule SpadesWeb.RoomController do
  use SpadesWeb, :controller

  alias Spades.Rooms
  alias Spades.Rooms.Room

  # alias SpadesUtil.{NameGenerator, Slugify}
  # alias SpadesGame.GameSupervisor

  action_fallback SpadesWeb.FallbackController

  def index(conn, _params) do
    rooms = Rooms.list_rooms()
    render(conn, "index.json", rooms: rooms)
  end

  # Create: Removed, users no longer able to create rooms by API
  # Possibly this entire controller should be removed

  def show(conn, %{"id" => id}) do
    room = Rooms.get_room!(id)
    render(conn, "show.json", room: room)
  end

  def update(conn, %{"id" => id, "room" => room_params}) do
    room = Rooms.get_room!(id)

    with {:ok, %Room{} = room} <- Rooms.update_room(room, room_params) do
      render(conn, "show.json", room: room)
    end
  end

  def delete(conn, %{"id" => id}) do
    room = Rooms.get_room!(id)

    with {:ok, %Room{}} <- Rooms.delete_room(room) do
      send_resp(conn, :no_content, "")
    end
  end
end
