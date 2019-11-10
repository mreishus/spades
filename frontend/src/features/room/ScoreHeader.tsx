import React, { useState } from "react";
import Button from "../../components/basic/Button";
import ScoreModal from "./ScoreModal";
import { GameScore } from "elixir-backend";

interface Props {
  score: GameScore;
}

export const ScoreHeader: React.FC<Props> = ({ score }) => {
  const [showModal, setShowModal] = useState(false);
  const { north_south_score, east_west_score } = score;
  return (
    <div>
      North|South: {north_south_score}
      <span className="ml-4">East|West: {east_west_score}</span>
      <span className="ml-4">
        <Button isPrimary onClick={() => setShowModal(true)}>
          See Score Sheet
        </Button>
      </span>
      <ScoreModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
        score={score}
      />
    </div>
  );
};
export default ScoreHeader;
