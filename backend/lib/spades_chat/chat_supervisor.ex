defmodule SpadesChat.ChatSupervisor do
  @moduledoc """
  A supervisor that starts `ChatServer` processes dynamically.
  """

  use DynamicSupervisor

  alias SpadesChat.ChatServer

  def start_link(_arg) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @doc """
  Starts a `ChatServer` process and supervises it.
  """
  def start_chat(chat_name) do
    child_spec = %{
      id: ChatServer,
      start: {ChatServer, :start_link, [chat_name]},
      restart: :transient
    }

    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end

  def start_chat_if_needed(chat_name) do
    pid = ChatServer.chat_pid(chat_name)

    if pid == nil do
      start_chat(chat_name)
    else
      {:ok, pid}
    end
  end

  @doc """
  Terminates the `ChatServer` process normally. It won't be restarted.
  """
  def stop_chat(chat_name) do
    child_pid = ChatServer.chat_pid(chat_name)
    DynamicSupervisor.terminate_child(__MODULE__, child_pid)
  end
end
