defmodule DragnCardsChat.Chat do
  @moduledoc """
  Chat:  A structure and some stateless functions for defining
  a chat room.

  A chat room is essentially an append-only log of messages that
  can be queried.  If the number of messages goes over the new limit,
  the newest message will kick out the oldest message.
  """
  defstruct messages: [], limit: 250, chat_name: ""

  @doc """
  messages/1: Get a list of chat messages.
  Input: %Chat{}
  Output: [ any ], newest at last.
  """
  def messages(chat) do
    chat.messages |> Enum.reverse()
  end

  @doc """
  add_message/2: Add a message to the chat.
  Input: %Chat{}
  Input: message (any)
  Output: %Chat{}
  """
  def add_message(chat, message) do
    new_messages = [message | chat.messages] |> Enum.take(chat.limit)
    %{chat | messages: new_messages}
  end
end
