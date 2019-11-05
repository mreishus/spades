import React, { useState } from "react";
import cx from "classnames";
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
  broadcast: (eventName: string, payload: object) => void;
}

const cardToString = (card: Card) => card.rank.toString() + card.suit;

export const Hand: React.FC<Props> = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  cards.sort(handSort);
  const cards_string = cards.map(cardToString);

  return (
    <div className="flex">
      {cards_string.map(card => (
        <img
          key={card}
          src={`/images/cards3/${card}.png`}
          alt=".."
          draggable={false}
          unselectable="on"
          className={cx({
            "h-32 object-cover -ml-16 z-30 hand-card-animate": true,
            "-mt-5 mr-5 hand-card-selected": selectedCard === card
          })}
          onClick={() => {
            if (selectedCard === card) {
              // Send play command
              // Display error message only if it's my turn(?)
              setSelectedCard(null);
            } else {
              setSelectedCard(card);
            }
          }}
        />
      ))}
    </div>
  );
};
export default Hand;
