defmodule SpadesWeb.RoomController do
  use SpadesWeb, :controller

  alias Spades.Rooms
  alias Spades.Rooms.Room
  alias SpadesUtil.{NameGenerator, Slugify}
  alias SpadesGame.GameSupervisor

  action_fallback SpadesWeb.FallbackController

  def index(conn, _params) do
    rooms = Rooms.list_rooms()
    render(conn, "index.json", rooms: rooms)
  end

  def authtest(conn, params) do
    user =
      conn
      |> Pow.Plug.current_user()
      |> IO.inspect(label: "user")

    userid =
      case user do
        nil -> nil
        _ -> user.id
      end

    result = %{fake: "data", userid: userid, now: DateTime.utc_now()}

    case user do
      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{code: 401, message: "Not authenticated"}})

      _ ->
        conn |> json(result)

        # _ ->
        #   conn
        #   |> put_status(401)
        #   |> json(%{error: %{code: 401, message: "Not authenticated"}})
    end
  end

  def create(conn, %{"room" => room_params}) do
    game_name = NameGenerator.generate()

    room_params =
      room_params
      |> Map.put("name", game_name)
      |> Map.put("slug", Slugify.slugify(game_name))

    with {:ok, _pid} <- GameSupervisor.start_game(game_name),
         {:ok, %Room{} = room} <- Rooms.create_room(room_params) do
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
