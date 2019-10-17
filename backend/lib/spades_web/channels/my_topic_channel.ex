defmodule SpadesWeb.MyTopicChannel do
  @moduledoc """
  ..
  """
  use SpadesWeb, :channel

  def join("mytopic:" <> _subtopic, _params, socket) do
    :timer.send_interval(5_000, :ping)
    {:ok, assign(socket, :count, 1)}
  end

  def handle_info(:ping, socket) do
    count = socket.assigns[:count] || 1
    push(socket, "ping", %{count: count})
    {:noreply, assign(socket, :count, count + 1)}
  end

  # When user clicks button, increment by 100
  def handle_in("thisevent", _payload, socket) do
    # payload |> IO.inspect(label: "Client sent [thisevent] Got Payload")
    count = socket.assigns[:count] || 1
    {:noreply, assign(socket, :count, count + 100)}
  end
end
