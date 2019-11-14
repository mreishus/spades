import React, { useState } from "react";
import Button from "../../components/basic/Button";
import ScoreModal from "./ScoreModal";
import useGameUIView from "../../hooks/useGameUIView";

interface Props {}

export const ScoreButton: React.FC<Props> = () => {
  const gameUIView = useGameUIView();
  const [showModal, setShowModal] = useState(false);
  if (gameUIView === null) {
    return null;
  }
  const score = gameUIView.game_ui.game.score;
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
