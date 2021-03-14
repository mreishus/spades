import React, { useState, useCallback } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import useChannel from "../../hooks/useChannel";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import { ChatMessage } from "elixir-backend";

interface Props {
  chatBroadcast: (eventName: string, payload: object) => void;
  setTyping: React.Dispatch<React.SetStateAction<Boolean>>
}

export const Chat: React.FC<Props> = ({ chatBroadcast, setTyping }) => {
  const isLoggedIn = useIsLoggedIn();
  console.log("rendering chat")
  return (

    <div className="overflow-hidden h-full">
      <div className="bg-gray-800 overflow-y-auto rounded-lg" style={{height: "calc(100% - 32px)"}}>
        <ChatMessages/>
      </div>
      <div className="text-center" >
        {isLoggedIn && <ChatInput chatBroadcast={chatBroadcast} setTyping={setTyping} />}
      </div>
    </div>
  );
};
export default React.memo(Chat);
