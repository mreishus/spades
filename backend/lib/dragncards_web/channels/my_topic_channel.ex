defmodule DragnCardsWeb.MyTopicChannel do
  @moduledoc """
  ..
  """
  use DragnCardsWeb, :channel

  def join("mytopic:" <> _subtopic, _params, socket) do
    # "Mytopic Join" |> IO.inspect()
    :timer.send_interval(10_000, :ping)
    {:ok, assign(socket, :count, 1)}
  end

  def handle_info(:ping, socket) do
    count = socket.assigns[:count] || 1
    # "Ping #{count}" |> IO.inspect()
    push(socket, "ping", %{count: count})
    {:noreply, assign(socket, :count, count + 1)}
  end

  # When user clicks button, increment by 100
  def handle_in("thisevent", _payload, socket) do
    # "this event" |> IO.inspect()
    # payload |> IO.inspect(label: "Client sent [thisevent] Got Payload")
    count = socket.assigns[:count] || 1
    {:noreply, assign(socket, :count, count + 100)}
  end
end
