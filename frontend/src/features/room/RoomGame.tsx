import React from "react";
import Button from "../../components/basic/Button";
import Hand from "./Hand";

interface Props {
  gameState: any;
  broadcast: (eventName: string, payload: object) => void;
}

export const RoomGame: React.FC<Props> = ({ gameState, broadcast }) => {
  if (gameState == null) {
    return null;
  }
  return (
    <>
      <div className="flex mt-12">
        <div className="w-1/5 xbg-gray-100 h-12"></div>
        <div className="w-3/5 xbg-gray-200 h-12">Top Player</div>
        <div className="w-1/5 xbg-gray-100 h-12"></div>
      </div>
      <div className="flex my-1 h-56 max-w-xl">
        <div className="w-1/5 xbg-gray-100 h-32">Left Player</div>
        <div className="w-3/5 xbg-gray-200 h-56">
          <div className="h-56 bg-orange-200 border rounded-lg"></div>
        </div>
        <div className="w-1/5 xbg-gray-100 h-32"> Right player</div>
      </div>
      <div className="flex mb-12">
        <div className="w-1/5 xbg-gray-100 h-12"></div>
        <div className="w-3/5 xbg-gray-200 h-12">
          Bottom Player
          <Hand />
        </div>
        <div className="w-1/5 xbg-gray-100 h-12"></div>
      </div>
      <div className="mt-4">
        <div>draw pile: {gameState.draw.length} cards</div>
        <div>discard pile: {gameState.discard.length} cards</div>
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
