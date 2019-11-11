import React, { useState, useCallback } from "react";
import RotateTableProvider from "./RotateTableProvider";
import RoomGame from "./RoomGame";
import RoomStaging from "./RoomStaging";
import Container from "../../components/basic/Container";
import Button from "../../components/basic/Button";

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
      console.log("Got new game state: ", game_ui_view);
      setGameUIView(game_ui_view);
    }
  }, []);
  const broadcast = useChannel(`room:${slug}`, onChannelMessage);

  const statusIs = (targetStatus: string) =>
    gameUIView != null &&
    gameUIView.game_ui.status != null &&
    gameUIView.game_ui.status === targetStatus;

  const isStaging = statusIs("staging");
  const isPlaying = statusIs("playing");

  const game_ui = gameUIView != null ? gameUIView.game_ui : null;
  return (
    <Container>
      <div>
        <div className="text-xl">
          {slug}

          <Button
            className="mt-2 text-xs inline-block ml-2"
            onClick={() => broadcast("request_state", { stuff: 1 })}
          >
            Request State Update
          </Button>
          <Button
            className="mt-2 text-xs inline-block ml-2"
            onClick={() => console.log(gameUIView)}
          >
            State to console
          </Button>
        </div>
        {isStaging && <RoomStaging gameState={game_ui} broadcast={broadcast} />}
        {isPlaying && gameUIView != null && (
          <RotateTableProvider gameUIView={gameUIView}>
            <RoomGame gameUIView={gameUIView} broadcast={broadcast} />
          </RotateTableProvider>
        )}
      </div>
    </Container>
  );
};
export default Room;
