import React, { useState, useCallback } from "react";
import RoomGame from "./RoomGame";
import RoomStaging from "./RoomStaging";
import Container from "../../components/basic/Container";
import Button from "../../components/basic/Button";

import useChannel from "../../hooks/useChannel";

interface Props {
  slug: string;
}

export const Room: React.FC<Props> = ({ slug }) => {
  const [gameState, setGameState] = useState<any>(null);
  const onChannelMessage = useCallback((event, payload) => {
    console.log("[room] Got channel message", event, payload);
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.game_state != null
    ) {
      const { game_state } = payload.response;
      console.log("Got new game state: ", game_state);
      setGameState(game_state);
    }
  }, []);
  const broadcast = useChannel(`room:${slug}`, onChannelMessage);

  const statusIs = (targetStatus: string) =>
    gameState != null &&
    gameState.status != null &&
    gameState.status === targetStatus;

  const isStaging = statusIs("staging");
  const isPlaying = statusIs("playing");

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
            onClick={() => console.log(gameState)}
          >
            State to console
          </Button>
        </div>
        {isStaging && (
          <RoomStaging gameState={gameState} broadcast={broadcast} />
        )}
        {isPlaying && <RoomGame gameState={gameState} broadcast={broadcast} />}
      </div>
    </Container>
  );
};
export default Room;
