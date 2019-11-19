import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ChatMessagesInner from "./ChatMessagesInner";
import { ChatMessage } from "elixir-backend";

interface Props {
  messages: Array<ChatMessage>;
}

export const ChatMessages: React.FC<Props> = ({ messages }) => {
  return (
    <ScrollToBottom className="bg-white border rounded max-w-md p-2 h-32 overflow-y-auto">
      <ChatMessagesInner messages={messages} />
    </ScrollToBottom>
  );
};
export default ChatMessages;
