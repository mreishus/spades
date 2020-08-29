import React from "react";
import ScoreButton from "./ScoreButton";

interface Props {
  round_number: number;
}

export const ScoreHeader: React.FC<Props> = ({ round_number }) => {
  return (
    <div>
      <span className="mr-2">Round: {round_number}</span>{" "}
    </div>
  );
};
export default ScoreHeader;
