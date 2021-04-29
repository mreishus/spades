defmodule ChatServerTest do
  use ExUnit.Case, async: true
  alias DragnCardsChat.{ChatServer}

  describe "start_link/1" do
    test "spawns a process" do
      chat_name = generate_chat_name()

      assert {:ok, _pid} = ChatServer.start_link(chat_name)
    end

    test "each name can only have one process" do
      chat_name = generate_chat_name()

      assert {:ok, _pid} = ChatServer.start_link(chat_name)
      assert {:error, _reason} = ChatServer.start_link(chat_name)
    end
  end

  describe "add_message/2 and messages/1" do
    test "general message persistance" do
      chat_name = generate_chat_name()
      assert {:ok, _pid} = ChatServer.start_link(chat_name)

      ChatServer.add_message(chat_name, "m1")
      ChatServer.add_message(chat_name, "m2")
      ChatServer.add_message(chat_name, "m3")
      messages = ChatServer.messages(chat_name)
      assert messages == ["m1", "m2", "m3"]
    end

    test "message limit 250" do
      chat_name = generate_chat_name()
      assert {:ok, _pid} = ChatServer.start_link(chat_name)

      1..1000
      |> Enum.each(fn _ ->
        ChatServer.add_message(chat_name, "hi")
      end)

      messages = ChatServer.messages(chat_name)
      assert length(messages) == 250
    end
  end

  defp generate_chat_name do
    "chat-#{:rand.uniform(1_000_000)}"
  end
end
