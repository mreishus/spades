import React, { useState } from "react";
import Button from "../../components/basic/Button";
import ScoreModal from "./ScoreModal";
import { GameScore } from "elixir-backend";

interface Props {
  score: GameScore;
}

export const ScoreButton: React.FC<Props> = ({ score }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button isPrimary onClick={() => setShowModal(true)}>
        See Score Sheet
      </Button>
      <ScoreModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
        score={score}
      />
    </>
  );
};
export default ScoreButton;
