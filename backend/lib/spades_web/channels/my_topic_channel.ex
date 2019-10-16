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
end
