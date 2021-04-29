defmodule DragnCardsWeb.API.V1.GameController do
  use DragnCardsWeb, :controller

  require Logger

  alias DragnCards.Rooms
  alias DragnCards.Rooms.Room
  alias DragnCardsUtil.{NameGenerator}
  alias DragnCardsGame.{GameOptions, GameUISupervisor}

  def create(conn, _params) do
    IO.puts("game_controller create")
    # IO.inspect(conn)
    # IO.inspect(_params)
    game_name = NameGenerator.generate()
    IO.puts("gamecontroller create b")
    IO.inspect(conn)
    user = _params["room"]["user"]
    # user = Pow.Plug.current_user(conn)
    IO.puts("gamecontroller create c")
    IO.inspect(user)
    options = %GameOptions{}
    # IO.puts("gamecontroller create d")
    #IO.puts(game_name)
    GameUISupervisor.start_game(game_name, user, options)
    # IO.puts("gamecontroller create e")
    room = Rooms.get_room_by_name(game_name)
    # IO.puts("ROOM")
    # IO.inspect(room)
    # with {:ok, _pid} <- GameUISupervisor.start_game(game_name, options),
    #      %Room{} = room <- Rooms.get_room_by_name(game_name) do
    if room do
      IO.puts("game ok")
      conn
      |> put_status(:created)
      |> json(%{success: %{message: "Created game", room: room}})
    else
      IO.puts("game not ok")
      conn
      |> put_status(500)
      |> json(%{error: %{status: 500, message: "Unable to create game"}})
    end
    #IO.inspect(game_name)
    #IO.inspect(conn)
  end
end
