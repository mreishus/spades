# test/my_app_web/api_auth_plug_test.exs
defmodule DragnCardsWeb.APIAuthPlugTest do
  use DragnCardsWeb.ConnCase
  doctest DragnCardsWeb.APIAuthPlug

  alias DragnCardsWeb.APIAuthPlug
  alias DragnCards.{Repo, Users.User}

  @pow_config [otp_app: :dragncards]

  test "can fetch, create, delete, and renew session for user", %{conn: conn} do
    user = Repo.insert!(%User{id: 1, email: "test@example.com"})

    assert {_conn, nil} = APIAuthPlug.fetch(conn, @pow_config)

    assert {new_conn, _user} = APIAuthPlug.create(conn, user, @pow_config)
    :timer.sleep(100)
    assert auth_token = new_conn.private[:api_auth_token]
    assert renew_token = new_conn.private[:api_renew_token]

    auth_conn = Plug.Conn.put_req_header(conn, "authorization", auth_token)
    assert {_conn, fetched_user} = APIAuthPlug.fetch(auth_conn, @pow_config)
    assert fetched_user.id == user.id

    APIAuthPlug.delete(auth_conn, @pow_config)
    :timer.sleep(100)
    assert {_conn, nil} = APIAuthPlug.fetch(auth_conn, @pow_config)

    renew_conn = Plug.Conn.put_req_header(conn, "authorization", renew_token)
    assert {new_conn, user} = APIAuthPlug.renew(renew_conn, @pow_config)
    assert auth_token = new_conn.private[:api_auth_token]
    :timer.sleep(100)

    auth_conn = Plug.Conn.put_req_header(conn, "authorization", auth_token)

    assert {_conn, nil} = APIAuthPlug.renew(renew_conn, @pow_config)
    assert {_conn, fetched_user} = APIAuthPlug.fetch(auth_conn, @pow_config)
    assert fetched_user.id == user.id
  end
end
