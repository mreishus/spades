import React from "react";
import { Card } from "elixir-backend";

const suitValues = {
  s: 400,
  h: 300,
  c: 200,
  d: 100
};

const handSort = (a: Card, b: Card) => {
  const aVal = suitValues[a.suit] + a.rank;
  const bVal = suitValues[b.suit] + b.rank;
  if (aVal < bVal) {
    return -1;
  }
  if (aVal > bVal) {
    return 1;
  }
  return 0;
};

interface Props {
  cards: Array<Card>;
}

export const Hand: React.FC<Props> = ({ cards }) => {
  cards.sort(handSort);
  const cards_string = cards.map(card => card.rank.toString() + card.suit);

  return (
    <div className="flex">
      {cards_string.map(card => (
        <img
          key={card}
          src={`/images/cards3/${card}.png`}
          alt=".."
          className="h-32 object-cover -ml-16"
        />
      ))}
    </div>
  );
};
export default Hand;
