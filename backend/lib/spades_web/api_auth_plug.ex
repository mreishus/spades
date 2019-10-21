defmodule SpadesWeb.APIAuthPlug do
  @moduledoc false
  use Pow.Plug.Base

  alias Plug.Conn
  alias Pow.{Config, Store.CredentialsCache}
  alias PowPersistentSession.Store.PersistentSessionCache

  @impl true
  @spec fetch(Conn.t(), Config.t()) :: {Conn.t(), map() | nil}
  def fetch(conn, config) do
    token = fetch_auth_token(conn)

    config
    |> store_config()
    |> CredentialsCache.get(token)
    |> case do
      :not_found -> {conn, nil}
      user -> {conn, user}
    end
  end

  @impl true
  @spec create(Conn.t(), map(), Config.t()) :: {Conn.t(), map()}
  def create(conn, user, config) do
    store_config = store_config(config)
    token = Pow.UUID.generate()
    renew_token = Pow.UUID.generate()

    conn =
      conn
      |> Conn.put_private(:api_auth_token, token)
      |> Conn.put_private(:api_renew_token, renew_token)

    CredentialsCache.put(store_config, token, user)
    PersistentSessionCache.put(store_config, renew_token, user.id)

    {conn, user}
  end

  @impl true
  @spec delete(Conn.t(), Config.t()) :: Conn.t()
  def delete(conn, config) do
    token = fetch_auth_token(conn)

    config
    |> store_config()
    |> CredentialsCache.delete(token)

    conn
  end

  @doc """
  Create a new token with the provided authorization token.

  The renewal authorization token will be deleted from the store after the user id has been fetched.
  """
  @spec renew(Conn.t(), Config.t()) :: {Conn.t(), map() | nil}
  def renew(conn, config) do
    renew_token = fetch_auth_token(conn)
    store_config = store_config(config)
    user_id = PersistentSessionCache.get(store_config, renew_token)

    PersistentSessionCache.delete(store_config, renew_token)

    load_and_create_session(user_id, conn, config)
  end

  @doc """
  Used by Websocket / Made by Matt, probably not right
  """
  @spec fetch(Config.t(), String.t()) :: map() | nil
  def fetch_from_token(config, token) do
    config
    |> store_config()
    |> CredentialsCache.get(token)
    |> case do
      :not_found -> nil
      user -> user
    end
  end

  defp load_and_create_session(:not_found, conn, _config), do: {conn, nil}

  defp load_and_create_session(user_id, conn, config) do
    case Pow.Operations.get_by([id: user_id], config) do
      nil -> {conn, nil}
      user -> create(conn, user, config)
    end
  end

  defp fetch_auth_token(conn) do
    conn
    |> Plug.Conn.get_req_header("authorization")
    |> List.first()
  end

  defp store_config(config) do
    backend = Config.get(config, :cache_store_backend, Pow.Store.Backend.EtsCache)

    [backend: backend]
  end
end
