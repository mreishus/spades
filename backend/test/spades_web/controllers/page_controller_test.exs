defmodule SpadesWeb.PageControllerTest do
  use SpadesWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ ""
  end
end
