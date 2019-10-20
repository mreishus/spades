import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";
import Button from "../../components/basic/Button";

interface Props {
  gameState: any;
  broadcast: (eventName: string, payload: object) => void;
}

export const RoomGame: React.FC<Props> = ({ gameState, broadcast }) => {
  if (gameState == null) {
    return null;
  }
  return (
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
  );
};
export default RoomGame;
