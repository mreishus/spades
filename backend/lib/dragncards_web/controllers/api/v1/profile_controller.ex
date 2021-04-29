defmodule DragnCardsWeb.API.V1.ProfileController do
  use DragnCardsWeb, :controller
  alias DragnCards.Users
  alias DragnCards.Users.User
  alias Plug.Conn

  # Index: Get my own private profile.
  @spec index(Conn.t(), map()) :: Conn.t()
  def index(conn, _params) do
    user = Pow.Plug.current_user(conn)
    IO.puts("profile controller index")
    IO.inspect(user)

    case user do
      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{code: 401, message: "Not authenticated"}})

      _ ->
        json(conn, %{user_profile: User.to_my_profile(user)})
    end
  end

  # Show: Look up the public profile of another user.
  @spec show(Conn.t(), map()) :: Conn.t()
  def show(conn, %{"id" => user_id}) do
    user = Users.get_user(user_id)

    case user do
      nil ->
        conn
        |> put_status(404)
        |> json(%{error: %{code: 404, message: "Not Found"}})

      _ ->
        json(conn, %{user_profile: User.to_public_profile(user)})
    end
  end
end
