import React, { useState, useCallback } from "react";
//import cx from "classnames";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import useChannel from "../../hooks/useChannel";

interface Props {
  roomName: string;
}

export const Chat: React.FC<Props> = ({ roomName }) => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const onChannelMessage = useCallback((event, payload) => {
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.messages != null
    ) {
      setMessages(payload.response.messages);
    } else {
      console.log("== Chat got (ignored) message", event, payload);
    }
  }, []);
  const broadcast = useChannel(`chat:${roomName}`, onChannelMessage);

  return (
    <div>
      Chat
      <div className="mb-2">
        <ChatMessages messages={messages} />
      </div>
      <ChatInput broadcast={broadcast} />
    </div>
  );
};
export default Chat;
