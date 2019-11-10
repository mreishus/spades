import React from "react";
import ReactModal from "react-modal";
import Button from "../../components/basic/Button";
import ScoreTable from "./ScoreTable";
import { GameScore } from "elixir-backend";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  score: GameScore;
}

ReactModal.setAppElement("#root");

export const ScoreModal: React.FC<Props> = ({ isOpen, closeModal, score }) => {
  return (
    <ReactModal
      closeTimeoutMS={200}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Minimal Modal Example"
      overlayClassName="fixed inset-0 bg-black-50 z-50"
      className="insert-auto overflow-auto p-5 bg-gray-100 border max-w-lg mx-auto my-12 rounded-lg outline-none"
    >
      <h1 id="heading">Score</h1>
      <ScoreTable score={score} />
      <Button onClick={closeModal} className="ml-2">
        OK
      </Button>
    </ReactModal>
  );
};
export default ScoreModal;
