defmodule ChatSupervisorTest do
  use ExUnit.Case, async: true

  alias DragnCardsChat.{ChatSupervisor, ChatServer}

  describe "start_chat/1" do
    test "spawns a chat server process" do
      chat_name = "chat-#{:rand.uniform(1000)}"
      assert {:ok, _pid} = ChatSupervisor.start_chat(chat_name)

      via = ChatServer.via_tuple(chat_name)
      assert GenServer.whereis(via) |> Process.alive?()
    end

    test "returns an error if chat is already started" do
      chat_name = "chat-#{:rand.uniform(1000)}"

      assert {:ok, pid} = ChatSupervisor.start_chat(chat_name)
      assert {:error, {:already_started, ^pid}} = ChatSupervisor.start_chat(chat_name)
    end
  end

  describe "stop_chat" do
    test "terminates the process normally" do
      chat_name = "chat-#{:rand.uniform(1000)}"
      {:ok, _pid} = ChatSupervisor.start_chat(chat_name)
      via = ChatServer.via_tuple(chat_name)

      assert :ok = ChatSupervisor.stop_chat(chat_name)
      refute GenServer.whereis(via)
    end
  end
end
