defmodule SpadesWeb.RoomChannel do
  @moduledoc """
  This channel will handle individual game rooms.
  """
  use SpadesWeb, :channel
  alias SpadesGame.{GameServer}
  require Logger

  def join("room:" <> room_slug, _payload, socket) do
    # if authorized?(payload) do
    state = GameServer.state(room_slug)

    socket =
      socket
      |> assign(:room_slug, room_slug)
      |> assign(:game_state, state)

    # {:ok, socket}
    {:ok, client_state(socket), socket}
    # else
    #   {:error, %{reason: "unauthorized"}}
    # end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  def handle_in("request_state", _payload, %{assigns: %{room_slug: room_slug}} = socket) do
    # payload |> IO.inspect()
    # Can also send back "{:reply, :ok, socket}" or send back "{:noreply, socket}"
    state = GameServer.state(room_slug)
    socket = socket |> assign(:game_state, state)
    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
        "discard_card",
        _payload,
        %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
      ) do
    Logger.info("Discard button pressed by #{user_id}")
    GameServer.discard(room_slug)
    state = GameServer.state(room_slug)
    socket = socket |> assign(:game_state, state)
    # Notify and then reply makes the person who clicked it get the
    # message twice
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  defp notify(socket) do
    # Fake a phx_reply event to everyone
    payload = %{
      response: client_state(socket),
      status: "ok"
    }

    broadcast!(socket, "phx_reply", payload)
  end

  # Add authorization logic here as required.
  # defp authorized?(_payload) do
  #   true
  # end

  # This is what part of the state gets sent to the client.
  # It can be used to transform or hide it before they get it.
  defp client_state(socket) do
    socket.assigns
  end
end
