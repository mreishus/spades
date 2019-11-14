import React from "react";
import ScoreButton from "./ScoreButton";
import { GameScore } from "elixir-backend";

interface Props {
  round_number: number;
  score: GameScore;
}

export const ScoreHeader: React.FC<Props> = ({ round_number, score }) => {
  const { north_south_score, east_west_score, east_west_rounds } = score;
  const showButton = east_west_rounds.length > 0;
  return (
    <div>
      <span className="mr-2">Round Number: {round_number}</span> North/South:{" "}
      {north_south_score}
      <span className="ml-4">East/West: {east_west_score}</span>
      {showButton && (
        <span className="ml-4">
          <ScoreButton />
        </span>
      )}
    </div>
  );
};
export default ScoreHeader;
