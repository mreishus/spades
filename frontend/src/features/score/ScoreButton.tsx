import React, { useState, useEffect } from "react";
import Button from "../../components/basic/Button";
import ScoreModal from "./ScoreModal";
import useGameUIView from "../../hooks/useGameUIView";
import usePrevious from "../../hooks/usePrevious";

interface Props {
  round_number?: number;
}

export const ScoreButton: React.FC<Props> = ({ round_number }) => {
  const gameUIView = useGameUIView();
  const [showModal, setShowModal] = useState(false);

  // Open score modal when a new round starts
  const previous_round_number = usePrevious(round_number);
  useEffect(() => {
    if (
      typeof round_number == "number" &&
      typeof previous_round_number == "number" &&
      round_number > previous_round_number &&
      previous_round_number >= 1
    ) {
      setShowModal(true);
    }
  }, [round_number, previous_round_number]);
  if (gameUIView === null) {
    return null;
  }
  return (
    <>
      <Button isPrimary onClick={() => setShowModal(true)}>
        See Score Sheet
      </Button>
      <ScoreModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
      />
    </>
  );
};
export default ScoreButton;
