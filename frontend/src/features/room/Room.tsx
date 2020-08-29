import React, { useState, useCallback } from "react";
import RoomGame from "./RoomGame";
import GameUIViewContext from "../../contexts/GameUIViewContext";
import {KeypressProvider} from '../../contexts/KeypressContext'
import useChannel from "../../hooks/useChannel";
import { GameUIView } from "elixir-backend";

interface Props {
  slug: string;
}

export const Room: React.FC<Props> = ({ slug }) => {
  const [gameUIView, setGameUIView] = useState<GameUIView | null>(null);
  const onChannelMessage = useCallback((event, payload) => {
    console.log("[room] Got channel message", event, payload);
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.game_ui_view != null
    ) {
      const { game_ui_view } = payload.response;
      //console.log("Got new game state: ", game_ui_view);
      setGameUIView(game_ui_view);
    }
  }, []);
  const broadcast = useChannel(`room:${slug}`, onChannelMessage);
  //if (gameUIView) broadcast("update_groups",gameUIView.game_ui.game.groups);
  console.log('rendering room');
  return (
    // <Container>
      <div className="gamebackground"
        style={{height: "97vh"}}
      >

      <KeypressProvider value={[""]}>
        {gameUIView != null && (
          <GameUIViewContext.Provider value={{gameUIView, setGameUIView}}>
            <RoomGame broadcast={broadcast}/>
         </GameUIViewContext.Provider>
        )}
        </KeypressProvider>
      </div>
    // </Container>
  );
};
export default Room;
