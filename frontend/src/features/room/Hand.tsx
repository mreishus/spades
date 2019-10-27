import React from "react";

interface Props {}

export const Hand: React.FC<Props> = () => {
  const cards = [
    "3d",
    "5d",
    "9d",
    "11d",
    "3c",
    "5c",
    "9c",
    "11c",
    "3h",
    "4h",
    "10h",
    "13h",
    "8s",
    "9s",
    "12s",
    "13s"
  ];
  return (
    <div className="flex">
      {cards.map(card => (
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
