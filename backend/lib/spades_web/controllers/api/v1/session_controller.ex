defmodule SpadesWeb.API.V1.SessionController do
  use SpadesWeb, :controller

  alias SpadesWeb.APIAuthPlug
  alias Plug.Conn

  @spec create(Conn.t(), map()) :: Conn.t()
  def create(conn, %{"user" => user_params}) do
    conn
    |> Pow.Plug.authenticate_user(user_params)
    |> case do
      {:ok, conn} ->
        json(conn, %{
          data: %{
            token: conn.private[:api_auth_token],
            renew_token: conn.private[:api_renew_token]
          }
        })

      {:error, conn} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid email or password"}})
    end
  end

  @spec renew(Conn.t(), map()) :: Conn.t()
  def renew(conn, _params) do
    config = Pow.Plug.fetch_config(conn)

    # config |> IO.inspect(label: "config")

    conn
    |> APIAuthPlug.renew(config)
    |> case do
      {conn, nil} ->
        # "Invalid token" |> IO.inspect()

        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})

      {conn, _user} ->
        # "Renew work!" |> IO.inspect()

        json(conn, %{
          data: %{
            token: conn.private[:api_auth_token],
            renew_token: conn.private[:api_renew_token]
          }
        })
    end
  end

  @spec delete(Conn.t(), map()) :: Conn.t()
  def delete(conn, _params) do
    {:ok, conn} = Pow.Plug.clear_authenticated_user(conn)

    json(conn, %{data: %{}})
  end

  def emailtestme(conn, _params) do
    {:ok, name} = Spades.Rot13.encode("Zngg Ervfuhf")
    {:ok, email} = Spades.Rot13.encode("z.ervfuhf@snfgznvy.pbz")
    Spades.UserEmail.another_test_email(%{name: name, email: email}) |> Spades.Mailer.deliver()

    conn
    |> json(%{success: %{message: "Sent Test Email"}})
  end
end
