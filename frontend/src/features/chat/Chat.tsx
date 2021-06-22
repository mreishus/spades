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
  const [chatOnly, setChatOnly] = useState(false);
  console.log("Rendering Chat")

  const handleChatOnlyClick = () => {
    setChatOnly(!chatOnly);
  }

  return (

    <div className="overflow-hidden h-full">
      
      <div className="bg-gray-800 overflow-y-auto" style={{height: "calc(100% - 32px)"}}>
        <ChatMessages chatOnly={chatOnly}/>
      </div>
      <div className="text-center" >
        {isLoggedIn && <ChatInput chatBroadcast={chatBroadcast} setTyping={setTyping}/>}
      </div>
      <div className="absolute bottom-0 right-0 text-white p-1 cursor-default" style={{ opacity: "20%", paddingRight: "50px"}}>
        <input
            type="checkbox"
            checked={chatOnly}
            onChange={handleChatOnlyClick}
            className="mr-1"
          />
          <span className="">Chat only</span>
      </div>
    </div>
  );
};
export default React.memo(Chat);
