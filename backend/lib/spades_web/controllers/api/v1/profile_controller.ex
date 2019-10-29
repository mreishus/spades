defmodule SpadesWeb.API.V1.ProfileController do
  use SpadesWeb, :controller
  alias Spades.Users.User
  alias Plug.Conn

  @spec index(Conn.t(), map()) :: Conn.t()
  def index(conn, _params) do
    user = Pow.Plug.current_user(conn)

    case user do
      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{code: 401, message: "Not authenticated"}})

      _ ->
        json(conn, %{user_profile: User.to_profile(user)})
    end
  end
end
