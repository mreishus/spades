import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ChatMessagesInner from "./ChatMessagesInner";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {
  messages: Array<string>;
}

export const ChatMessages: React.FC<Props> = ({ messages }) => {
  return (
    <ScrollToBottom className="bg-white border rounded max-w-md p-2 h-32 overflow-y-auto">
      <ChatMessagesInner messages={messages} />
    </ScrollToBottom>
  );
  /*
  return (
    <div className="bg-white border rounded max-w-md p-2 h-32 overflow-y-auto">
      <ChatMessagesInner messages={messages} />
    </div>
  );
   */
};
export default ChatMessages;
