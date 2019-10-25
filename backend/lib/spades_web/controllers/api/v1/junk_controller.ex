defmodule SpadesWeb.API.V1.JunkController do
  use SpadesWeb, :controller

  # alias Spades.Rooms
  # alias Spades.Rooms.Room
  # alias SpadesUtil.{NameGenerator, Slugify}
  # alias SpadesGame.GameSupervisor

  def authtest(conn, _params) do
    user =
      conn
      |> Pow.Plug.current_user()

    # |> IO.inspect(label: "user")

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
end
