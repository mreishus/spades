defmodule DragnCardsWeb.RoomChannel do
  @moduledoc """
  This channel will handle individual game rooms.
  """
  use DragnCardsWeb, :channel
  alias DragnCardsGame.{Card, GameUIServer, GameUI}

  require Logger

  def join("room:" <> room_slug, _payload, socket) do
    # if authorized?(payload) do
    IO.puts("roomchannel join a")
    state = GameUIServer.state(room_slug)

    socket =
      socket
      |> assign(:room_slug, room_slug)
      |> assign(:game_ui, state)
    IO.puts("socket")
    #IO.inspect(socket)
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
    socket = socket |> assign(:game_ui, state)
    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
        "sit",
        %{"playerN" => player_n},
        %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
      ) do
    GameUIServer.sit(room_slug, user_id, player_n)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)
    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
        "get_up",
        %{"playerN" => player_n},
        %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
      ) do
    GameUIServer.sit(room_slug, nil, player_n)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)
    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
        "bid",
        %{"bidNum" => bid_num},
        %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
      ) do
    GameUIServer.bid(room_slug, user_id, bid_num)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
        "play",
        %{"card" => card},
        %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
      ) do
    card = Card.from_map(card)
    # Ignoring return value; could work on passing an error up
    GameUIServer.play(room_slug, user_id, card)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "update_gameui",
    %{"gameui" => gameui},
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.update_gameui(room_slug, user_id, gameui)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "load_cards",
    %{"load_list" => load_list},
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.load_cards(room_slug, user_id, load_list)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "reset_game",
    %{},
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.reset_game(room_slug, user_id)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "peek_at",
    %{
      "group_id" => group_id,
      "stack_indices" => stack_indices,
      "card_indices" => card_indices,
      "player_n" => player_n,
      "reset_peek" => reset_peek,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    IO.puts("room_channel peek_at")
    GameUIServer.peek_at(room_slug, user_id, group_id, stack_indices, card_indices, player_n, reset_peek)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "move_stack",
    %{
      "stack_id" => stack_id,
      "dest_group_id" => dest_group_id,
      "dest_stack_index" => dest_stack_index,
      "combine" => combine,
      "preserve_state" => preserve_state,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.move_stack(room_slug, user_id, stack_id, dest_group_id, dest_stack_index, combine, preserve_state)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "move_stacks",
    %{
      "orig_group_id" => orig_group_id,
      "dest_group_id" => dest_group_id,
      "position" => position,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    IO.puts("roomchannel move_stacks a")
    GameUIServer.move_stacks(room_slug, user_id, orig_group_id, dest_group_id, position)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
      "update_card",
      %{
        "card" => card,
        "group_id" => group_id,
        "stack_index" => stack_index,
        "card_index" => card_index,
      },
      %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
    ) do
    GameUIServer.update_card(room_slug, user_id, card, group_id, stack_index, card_index)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
      "increment_token",
      %{
        "group_id" => group_id,
        "stack_index" => stack_index,
        "card_index" => card_index,
        "token_type" => token_type,
        "increment" => increment,
      },
      %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
    ) do
    IO.puts("room_channel increment_token")
    GameUIServer.increment_token(room_slug, user_id, group_id, stack_index, card_index, token_type, increment)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
      "deal_shadow",
      %{
        "group_id" => group_id,
        "stack_index" => stack_index
      },
      %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
    ) do
    GameUIServer.deal_shadow(room_slug, user_id, group_id, stack_index)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "move_card",
    %{
      "orig_group_id"    => orig_group_id,
      "orig_stack_index" => orig_stack_index,
      "orig_card_index"  => orig_card_index,
      "dest_group_id"    => dest_group_id,
      "dest_stack_index" => dest_stack_index,
      "dest_card_index"  => dest_card_index,
      "create_new_stack" => create_new_stack
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    IO.puts("room_channel move_card")
    GameUIServer.move_card(room_slug, user_id, orig_group_id, orig_stack_index, orig_card_index, dest_group_id, dest_stack_index, dest_card_index, create_new_stack)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)
    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "shuffle_group",
    %{
      "group_id" => group_id
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.shuffle_group(room_slug, user_id, group_id)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "toggle_exhaust",
    %{
      "group_id" => group_id,
      "stack_index" => stack_index,
      "card_index" => card_index,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.toggle_exhaust(room_slug, user_id, group_id, stack_index, card_index)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end


  def handle_in(
    "card_action",
    %{
      "action" => action,
      "card_id" => card_id,
      "options" => options,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.card_action(room_slug, user_id, action, card_id, options)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "game_action",
    %{
      "action" => action,
      "options" => options,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.game_action(room_slug, user_id, action, options)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    #notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "action_on_matching_cards",
    %{
      "criteria" => criteria,
      "action" => action,
      "options" => options,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.action_on_matching_cards(room_slug, user_id, criteria, action, options)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end


  def handle_in(
    "refresh",
    %{
      "player_n" => player_n,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.refresh(room_slug, user_id, player_n)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "set_first_player",
    %{
      "player_n" => player_n,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.set_first_player(room_slug, user_id, player_n)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "increment_threat",
    %{
      "player_n" => player_n,
      "increment" => increment,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.increment_threat(room_slug, user_id, player_n, increment)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
    notify(socket)

    {:reply, {:ok, client_state(socket)}, socket}
  end

  def handle_in(
    "increment_round",
    %{
      "increment" => increment,
    },
    %{assigns: %{room_slug: room_slug, user_id: user_id}} = socket
  ) do
    GameUIServer.increment_round(room_slug, user_id, increment)
    state = GameUIServer.state(room_slug)
    socket = socket |> assign(:game_ui, state)
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

  Note 1: After making this, I found a Phoenix Channel mechanism that lets
  you intercept and change outgoing messages.  That might be better.
  Note 2: "Outside" here means a caller from anywhere in the system can call
  this, unlike "notify".
  """
  def notify_from_outside(room_slug) do
    payload = %{}
    DragnCardsWeb.Endpoint.broadcast!("room:" <> room_slug, "ask_for_update", payload)
  end

  def terminate({:shutdown, :left}, socket) do
    on_terminate(socket)
  end

  def terminate({:shutdown, :closed}, socket) do
    on_terminate(socket)
  end

  defp on_terminate(%{assigns: %{room_slug: room_slug, user_id: user_id}} = socket) do
    state = GameUIServer.leave(room_slug, user_id)
    socket = socket |> assign(:game_ui, state)
    notify(socket)
  end

  defp notify(socket) do
    # # Fake a phx_reply event to everyone
    # payload = %{
    #   response: client_state(socket),
    #   status: "ok"
    # }

    # broadcast!(socket, "phx_reply", payload)
    broadcast!(socket, "ask_for_update", %{})
  end

  # This is what part of the state gets sent to the client.
  # It can be used to transform or hide it before they get it.
  defp client_state(socket) do
    user_id = Map.get(socket.assigns, :user_id) || 0
    IO.puts("client_state")
    socket.assigns
  end
end
