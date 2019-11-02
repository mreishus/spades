import React from "react";
import PlayerSeat from "./PlayerSeat";
import RoomStagingTimer from "./RoomStagingTimer";
import { GameUI } from "elixir-backend";

interface Props {
  gameState: GameUI | null;
  broadcast: (eventName: string, payload: object) => void;
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridGap: "1.5rem"
};

export const RoomStaging: React.FC<Props> = ({ broadcast, gameState }) => {
  if (gameState == null) {
    return null;
  }
  const { seats } = gameState;
  console.log("gs");
  console.log(gameState);
  return (
    <div>
      <div className="bg-white max-w-lg p-4 mx-auto rounded-lg mt-4">
        <h2 className="text-blue-800 font-semibold">Waiting For Players</h2>
        <div className="mt-4" style={gridStyle}>
          <div></div>
          <div className="text-center">
            North
            <div>
              <PlayerSeat
                seatState={seats}
                broadcast={broadcast}
                whichSeat="north"
              />
            </div>
          </div>
          <div></div>
          {/* --row-- */}
          <div className="text-right">
            West
            <div>
              <PlayerSeat
                seatState={seats}
                broadcast={broadcast}
                whichSeat="west"
              />
            </div>
          </div>
          <div></div>
          <div className="text-left">
            East
            <div>
              <PlayerSeat
                seatState={seats}
                broadcast={broadcast}
                whichSeat="east"
              />
            </div>
          </div>
          {/* --row-- */}
          <div></div>
          <div className="text-center">
            South
            <div>
              <PlayerSeat
                seatState={seats}
                broadcast={broadcast}
                whichSeat="south"
              />
            </div>
          </div>
          <div></div>
        </div>
        <RoomStagingTimer when_seats_full={gameState.when_seats_full} />
      </div>
    </div>
  );
};
export default RoomStaging;
