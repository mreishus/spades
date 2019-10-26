import React from "react";

interface Props {}

export const Hand: React.FC<Props> = () => {
  return (
    <div className="flex">
      <img
        src="/images/cards1/3d.png"
        alt="3 of diamonds"
        className="h-24 object-cover"
      />
      <img
        src="/images/cards1/13d.png"
        alt="King of diamonds"
        className="h-24 object-cover -ml-12"
      />
      <img
        src="/images/cards1/13s.png"
        alt="13 of spades"
        className="h-24 object-cover -ml-12"
      />
      <img
        src="/images/cards1/13h.png"
        alt="13 of hearts"
        className="h-24 object-cover -ml-12"
      />
    </div>
  );
};
export default Hand;
