import React from "react";
import Table from "./Table";
import { Card, GameUIView, Seat, TrickCard } from "elixir-backend";

interface Props {
  gameUIView: GameUIView;
}

let arrow = `/images/cards3/red-arrow-down.png`;

const imageUrlForCard = (card: Card) => {
  //let jack = `/images/cards3/11c.png`;
  return `/images/cards3/${card.rank.toString()}${card.suit}.png`;
};

const cardFromTrick = (trick: Array<TrickCard>, seat: Seat) => {
  const thisCardA = trick.filter(tc => tc.seat === seat);
  if (thisCardA.length === 0) {
    return null;
  }
  const thisCard = thisCardA[0].card;
  return imageUrlForCard(thisCard);
};

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

export const SmartTable: React.FC<Props> = ({ gameUIView }) => {
  const { my_seat } = gameUIView;
  const { game } = gameUIView.game_ui;
  const { trick } = game;

  // Seats with directions translated - Sitting at bottom
  const bottomSeat = translate("south", my_seat);
  const topSeat = translate("north", my_seat);
  const rightSeat = translate("east", my_seat);
  const leftSeat = translate("west", my_seat);

  const bottomPlayer = game[bottomSeat];
  const topPlayer = game[topSeat];
  const rightPlayer = game[rightSeat];
  const leftPlayer = game[leftSeat];

  // Arrow indicators if it's that seat's turn
  const bottomTurn = game.turn === bottomSeat ? arrow : null;
  const topTurn = game.turn === topSeat ? arrow : null;
  const rightTurn = game.turn === rightSeat ? arrow : null;
  const leftTurn = game.turn === leftSeat ? arrow : null;

  // The card they played during the trick
  const bottomCard = cardFromTrick(trick, bottomSeat);
  const topCard = cardFromTrick(trick, topSeat);
  const rightCard = cardFromTrick(trick, rightSeat);
  const leftCard = cardFromTrick(trick, leftSeat);

  return (
    <Table
      leftCard={leftTurn || leftCard}
      topCard={topTurn || topCard}
      rightCard={rightTurn || rightCard}
      bottomCard={bottomTurn || bottomCard}
      leftPlayer={leftPlayer}
      topPlayer={topPlayer}
      rightPlayer={rightPlayer}
      bottomPlayer={bottomPlayer}
      emphasizeBidding={game.status === "bidding"}
    />
  );
};
export default SmartTable;
