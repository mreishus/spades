defmodule DragnCardsWeb.RoomControllerTest do
  use DragnCardsWeb.ConnCase

  alias DragnCards.Rooms
  alias DragnCards.Rooms.Room

  @create_attrs %{
    name: "some name"
  }
  @update_attrs %{
    name: "some updated name"
  }

  # @invalid_attrs %{name: nil}

  def fixture(:room) do
    {:ok, room} = Rooms.create_room(@create_attrs)
    room
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all rooms", %{conn: conn} do
      conn = get(conn, Routes.room_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "update room" do
    setup [:create_room]

    test "renders room when data is valid", %{conn: conn, room: %Room{id: id} = room} do
      conn = put(conn, Routes.room_path(conn, :update, room), room: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.room_path(conn, :show, id))

      assert %{
               "id" => id,
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    ## Since names are automatically generated, and
    ## they're the only field right now, we can't
    ## generate invalid data.

    # test "renders errors when data is invalid", %{conn: conn, room: room} do
    #   conn = put(conn, Routes.room_path(conn, :update, room), room: @invalid_attrs)
    #   assert json_response(conn, 422)["errors"] != %{}
    # end
  end

  describe "delete room" do
    setup [:create_room]

    test "deletes chosen room", %{conn: conn, room: room} do
      conn = delete(conn, Routes.room_path(conn, :delete, room))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.room_path(conn, :show, room))
      end
    end
  end

  defp create_room(_) do
    room = fixture(:room)
    {:ok, room: room}
  end
end
