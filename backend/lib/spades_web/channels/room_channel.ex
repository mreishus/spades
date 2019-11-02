defmodule SpadesWeb.RoomChannel do
  @moduledoc """
  This channel will handle individual game rooms.
  """
  use SpadesWeb, :channel
  alias SpadesGame.{GameUIServer, GameUIView}

  require Logger

  def join("room:" <> room_slug, _payload, socket) do
    # if authorized?(payload) do
    state = GameUIServer.state(room_slug)

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
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_state, state)
    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
        "discard_card",
        _payload,
        %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
      ) do
    Logger.info("Discard button pressed by #{user_id}")
    GameUIServer.discard(room_slug)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_state, state)
    # Notify and then reply makes the person who clicked it get the
    # message twice
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
        "sit",
        %{"whichSeat" => which_seat},
        %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
      ) do
    GameUIServer.sit(room_slug, user_id, which_seat)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_state, state)
    notify(socket)
    {:reply, {:ok, client_state(socket)}, socket}
  end

  @doc """
  notify_from_outside/1: Tell everyone in the channel to send a message
  asking for a state update.
  This used to broadcast game state to everyone, but game state can contain
  private information.  So we tell everyone to ask for an update instead. Since
  we're over a websocket, the extra cost shouldn't be that bad.
  SERVER: "ask_for_update", %{}
  CLIENT: "request_state", %{}
  SERVER: "phx_reply", %{personalized state}
  """
  def notify_from_outside(room_slug) do
    payload = %{}
    SpadesWeb.Endpoint.broadcast!("room:" <> room_slug, "ask_for_update", payload)
  end

  def terminate({:shutdown, :left}, socket) do
    on_terminate(socket)
  end

  def terminate({:shutdown, :closed}, socket) do
    on_terminate(socket)
  end

  defp on_terminate(%{assigns: %{room_slug: room_slug, user_id: user_id}} = socket) do
    state = GameUIServer.leave(room_slug, user_id)
    socket = socket |> assign(:game_state, state)
    notify(socket)
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
    cond do
      Map.has_key?(socket.assigns, :gameui) ->
        %{
          socket.assigns
          | gameui: GameUIView.view_for(socket.assigns.gameui, socket.assigns.user_id)
        }

      true ->
        socket.assigns
    end
  end
end
