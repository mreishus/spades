defmodule SpadesWeb.API.V1.ConfirmationController do
  use SpadesWeb, :controller

  alias Plug.Conn

  # [PowEmailConfirmation.Plug] PowEmailConfirmation.Plug.confirm_email/2 with
  # token param as second argument has been deprecated in favor of
  # PowEmailConfirmation.Plug.load_user_by_token/2, and
  # PowEmailConfirmation.Plug.confirm_email/2 with map as second argument

  @spec show(Conn.t(), map()) :: Conn.t()
  def show(conn, %{"id" => token}) do
    case PowEmailConfirmation.Plug.load_user_by_token(conn, token) do
      {:error, conn} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid confirmation code"}})

      {:ok, conn} ->
        conn
        |> json(%{success: %{message: "Email confirmed"}})
    end
  end
end
