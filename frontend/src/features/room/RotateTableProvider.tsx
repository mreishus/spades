import React from "react";
import RotateTableContext from "../../contexts/RotateTableContext";
import { GameUIView, RotateTableContextType, Seat } from "elixir-backend";

interface Props {
  gameUIView: GameUIView;
  children: React.ReactNode;
}

const clockwise90 = (input: Seat): Seat => {
  // Done this way so TS can analyze
  if (input === "south") {
    return "west";
  } else if (input === "west") {
    return "north";
  } else if (input === "north") {
    return "east";
  } else if (input === "east") {
    return "south";
  }
  throw new Error("clockwise90: Clockwise of what?");
};

const counter_clockwise90 = (input: Seat): Seat => {
  // Done this way so TS can analyze
  if (input === "south") {
    return "east";
  } else if (input === "east") {
    return "north";
  } else if (input === "north") {
    return "west";
  } else if (input === "west") {
    return "south";
  }
  throw new Error("counter_clockwise90: Clockwise of what?");
};

const translate = (objective_seat: Seat, perspective: Seat | null): Seat => {
  if (perspective === null || perspective === "south") {
    return objective_seat;
  } else if (perspective === "west") {
    //North should appear to my LEFT (West)
    //South should appear to my RIGHT (East)
    return clockwise90(objective_seat);
  } else if (perspective === "north") {
    return clockwise90(clockwise90(objective_seat));
  } else if (perspective === "east") {
    return counter_clockwise90(objective_seat);
  }
  throw new Error("translate: What perspective?");
};

export const RotateTableProvider: React.FC<Props> = ({
  gameUIView,
  children
}) => {
  const { my_seat } = gameUIView;
  const { game } = gameUIView.game_ui;

  // Seats with directions translated - Sitting at bottom
  const bottomSeat = translate("south", my_seat);
  const topSeat = translate("north", my_seat);
  const rightSeat = translate("east", my_seat);
  const leftSeat = translate("west", my_seat);

  const bottomPlayer = game[bottomSeat];
  const topPlayer = game[topSeat];
  const rightPlayer = game[rightSeat];
  const leftPlayer = game[leftSeat];

  const value: RotateTableContextType = {
    bottomSeat,
    topSeat,
    rightSeat,
    leftSeat,
    bottomPlayer,
    topPlayer,
    rightPlayer,
    leftPlayer
  };

  return (
    <RotateTableContext.Provider value={value}>
      {children}
    </RotateTableContext.Provider>
  );
};
export default RotateTableProvider;
