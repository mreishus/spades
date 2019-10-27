import React, { useState, useCallback } from "react";
import RoomGame from "./RoomGame";
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

  return (
    <Container>
      <div>
        This is a room
        <div className="p-2 bg-purple-300 max-w-md rounded">{slug}</div>
        <Button
          className="mt-2"
          onClick={() => broadcast("request_state", { stuff: 1 })}
        >
          Request State Update
        </Button>
        <RoomGame gameState={gameState} broadcast={broadcast} />
      </div>
    </Container>
  );
};
export default Room;
