defmodule DragnCardsWeb.PageController do
  use DragnCardsWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def json_test(conn, _params) do
    conn
    |> json(%{id: 123})
  end
end
