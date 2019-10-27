import React from "react";
import PlayerSeat from "./PlayerSeat";
import Button from "../../components/basic/Button";
import Table from "./Table";
import Hand from "./Hand";

interface Props {
  gameState: any;
  broadcast: (eventName: string, payload: object) => void;
}

export const RoomGame: React.FC<Props> = ({ gameState, broadcast }) => {
  if (gameState == null) {
    return null;
  }
  const { seats } = gameState;
  return (
    <>
      <div className="flex mt-12">
        <div className="w-1/5 xbg-gray-100 h-12"></div>
        <div className="w-3/5 xbg-gray-200 h-12">
          Top Player
          <PlayerSeat
            seatState={seats}
            broadcast={broadcast}
            whichSeat="north"
          />
        </div>
        <div className="w-1/5 xbg-gray-100 h-12"></div>
      </div>
      <div className="flex my-1 h-56 max-w-xl">
        <div className="w-1/5 xbg-gray-100 h-32">
          Left Player
          <PlayerSeat
            seatState={seats}
            broadcast={broadcast}
            whichSeat="west"
          />
        </div>
        <div className="w-3/5 xbg-gray-200 h-56 relative">
          <Table />
        </div>
        <div className="w-1/5 xbg-gray-100 h-32">
          {" "}
          Right player
          <PlayerSeat
            seatState={seats}
            broadcast={broadcast}
            whichSeat="east"
          />
        </div>
      </div>
      <div className="flex mb-12">
        <div className="w-1/5 xbg-gray-100 h-12"></div>
        <div className="w-3/5 xbg-gray-200 h-12">
          Bottom Player
          <PlayerSeat
            seatState={seats}
            broadcast={broadcast}
            whichSeat="south"
          />
          <Hand />
        </div>
        <div className="w-1/5 xbg-gray-100 h-12"></div>
      </div>
      <div className="mt-4">
        <div>draw pile: {gameState.game.draw.length} cards</div>
        <div>discard pile: {gameState.game.discard.length} cards</div>
        <Button
          className="mt-1"
          isPrimary
          onClick={() => broadcast("discard_card", {})}
        >
          Discard
        </Button>
      </div>
    </>
  );
};
export default RoomGame;
