import React, { useState, useCallback } from "react";
import RoomGame from "./RoomGame";
import GameUIContext from "../../contexts/GameUIContext";
import {KeypressProvider} from '../../contexts/KeypressContext'
import {ActiveCardProvider} from '../../contexts/ActiveCardContext'
import useChannel from "../../hooks/useChannel";
import { GameUI, ChatMessage } from "elixir-backend";

interface Props {
  slug: string;
}

export const Room: React.FC<Props> = ({ slug }) => {
  const [gameUI, setGameUI] = useState<GameUI | null>(null);
  const onChannelMessage = useCallback((event, payload) => {
    console.log("[room] Got channel message", event, payload);
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.game_ui != null
    ) {
      const { game_ui } = payload.response;
      //console.log("Got new game state: ", game_ui_view);
      setGameUI(game_ui);
    }
  }, []);
  
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const onChatMessage = useCallback((event, payload) => {
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.messages != null
    ) {
      setMessages(payload.response.messages);
    }
  }, []);
  const gameBroadcast = useChannel(`room:${slug}`, onChannelMessage);
  const chatBroadcast = useChannel(`chat:${slug}`, onChatMessage);
  //if (gameUIView) broadcast("update_groups",gameUIView.game_ui.game.groups);
  console.log('rendering room');
  return (
    // <Container>
      <div className="gamebackground"
        style={{height: "97vh"}}
      >

      <KeypressProvider value={[""]}>
        {gameUI != null && (
          <GameUIContext.Provider value={{gameUI, setGameUI}}>
            <ActiveCardProvider value={null}>
              <RoomGame gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} messages={messages}/>
            </ActiveCardProvider>
         </GameUIContext.Provider>
        )}
        </KeypressProvider>
      </div>
    // </Container>
  );
};
export default Room;
