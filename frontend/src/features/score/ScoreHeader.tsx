import React from "react";
import ScoreButton from "./ScoreButton";
import GameTeam from "../room/GameTeam";
import { GameScore } from "elixir-backend";

interface Props {
  round_number: number;
  score: GameScore;
}

export const ScoreHeader: React.FC<Props> = ({ round_number, score }) => {
  const { north_south_score, east_west_score, east_west_rounds } = score;
  return (
    <div>
      <span className="mr-2">Round: {round_number}</span>{" "}
      <GameTeam isNorthSouth />: {north_south_score}
      <span className="ml-4">
        <GameTeam isEastWest />: {east_west_score}
      </span>
      <span className="ml-4">
        <ScoreButton round_number={round_number} />
      </span>
    </div>
  );
};
export default ScoreHeader;
