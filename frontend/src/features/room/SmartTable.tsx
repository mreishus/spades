import React from "react";
import Table from "./Table";
import { Card, Game, Seat, TrickCard } from "elixir-backend";

interface Props {
  game: Game;
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

export const SmartTable: React.FC<Props> = ({ game }) => {
  const { trick } = game;

  // Arrow indicators if it's that seat's turn
  const southTurn = game.turn === "south" ? arrow : null;
  const northTurn = game.turn === "north" ? arrow : null;
  const eastTurn = game.turn === "east" ? arrow : null;
  const westTurn = game.turn === "west" ? arrow : null;

  // The card they played during the trick
  const southCard = cardFromTrick(trick, "south");
  const northCard = cardFromTrick(trick, "north");
  const eastCard = cardFromTrick(trick, "east");
  const westCard = cardFromTrick(trick, "west");

  if (game.status === "bidding") {
    return (
      <Table
        leftCard={westTurn}
        topCard={northTurn}
        rightCard={eastTurn}
        bottomCard={southTurn}
        leftPlayer={game.west}
        topPlayer={game.north}
        rightPlayer={game.east}
        bottomPlayer={game.south}
        emphasizeBidding
      />
    );
  }
  return (
    <Table
      bottomCard={southTurn || southCard}
      topCard={northTurn || northCard}
      leftCard={westTurn || westCard}
      rightCard={eastTurn || eastCard}
      leftPlayer={game.west}
      topPlayer={game.north}
      rightPlayer={game.east}
      bottomPlayer={game.south}
    />
  );
};
export default SmartTable;
