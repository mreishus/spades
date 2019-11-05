import React from "react";
import Table from "./Table";
import { Game } from "elixir-backend";

interface Props {
  game: Game;
}

let arrow = `/images/cards3/red-arrow-down.png`;
//let jack = `/images/cards3/11c.png`;

export const SmartTable: React.FC<Props> = ({ game }) => {
  if (game.status === "bidding") {
    return (
      <Table
        leftCard={game.turn === "west" ? arrow : null}
        topCard={game.turn === "north" ? arrow : null}
        rightCard={game.turn === "east" ? arrow : null}
        bottomCard={game.turn === "south" ? arrow : null}
        leftPlayer={game.west}
        topPlayer={game.north}
        rightPlayer={game.east}
        bottomPlayer={game.south}
      />
    );
  }
  return (
    <Table
      bottomCard={game.turn === "south" ? arrow : null}
      topCard={game.turn === "north" ? arrow : null}
      leftCard={game.turn === "west" ? arrow : null}
      rightCard={game.turn === "east" ? arrow : null}
      leftPlayer={game.west}
      topPlayer={game.north}
      rightPlayer={game.east}
      bottomPlayer={game.south}
    />
  );
};
export default SmartTable;
