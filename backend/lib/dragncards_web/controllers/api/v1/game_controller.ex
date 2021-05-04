defmodule DragnCardsWeb.API.V1.GameController do
  use DragnCardsWeb, :controller

  require Logger

  alias DragnCards.Rooms
  alias DragnCards.Rooms.Room
  alias DragnCardsUtil.{NameGenerator}
  alias DragnCardsGame.{GameOptions, GameUISupervisor}

  def create(conn, _params) do
    Logger.debug("game_controller create")
    game_name = NameGenerator.generate()
    user = _params["room"]["user"]
    options = %GameOptions{}
    GameUISupervisor.start_game(game_name, user, options)
    room = Rooms.get_room_by_name(game_name)
    if room do
      Logger.debug("game ok")
      conn
      |> put_status(:created)
      |> json(%{success: %{message: "Created game", room: room}})
    else
      Logger.debug("game not ok")
      conn
      |> put_status(500)
      |> json(%{error: %{status: 500, message: "Unable to create game"}})
    end
  end
end
