defmodule DragnCardsWeb.API.V1.RegistrationControllerTest do
  use DragnCardsWeb.ConnCase

  describe "create/2" do
    @valid_params %{
      "user" => %{
        "email" => "test@example.com",
        "password" => "secret1234",
        "password_confirmation" => "secret1234",
        "alias" => "Test User"
      }
    }
    @invalid_params %{
      "user" => %{
        "email" => "invalid",
        "password" => "secret1234",
        "password_confirmation" => "",
        "alias" => ""
      }
    }

    test "with valid params", %{conn: conn} do
      conn = post(conn, Routes.api_v1_registration_path(conn, :create, @valid_params))

      assert json = json_response(conn, 200)
      assert json["data"]["token"]
      assert json["data"]["renew_token"]
    end

    test "with invalid params", %{conn: conn} do
      conn = post(conn, Routes.api_v1_registration_path(conn, :create, @invalid_params))

      assert json = json_response(conn, 500)

      assert json["error"]["message"] == "Couldn't create user"
      assert json["error"]["status"] == 500
      assert json["error"]["errors"]["password_confirmation"] == ["does not match confirmation"]
      assert json["error"]["errors"]["email"] == ["has invalid format"]
    end
  end
end
