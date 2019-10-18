import React, { useState } from "react";
import axios from "axios";
//import cx from "classnames";
import ReactModal from "react-modal";
import Button from "../../components/basic/Button";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

ReactModal.setAppElement("#root");

export const CreateRoomModal: React.FC<Props> = ({ isOpen, closeModal }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async () => {
    console.log("Creating..");
    const data = { hi: "hello" };
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await axios.post("/be/api/whatever", data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Minimal Modal Example"
      overlayClassName="fixed inset-0 bg-black-50"
      className="insert-auto overflow-auto p-5 bg-gray-100 border max-w-lg mx-auto my-12 rounded-lg outline-none"
    >
      <h1 id="heading">Create Room</h1>
      <div id="full_description" className="mt-2">
        <p>Description goes here.</p>
      </div>

      <div className="mt-4">
        <Button onClick={createRoom} isPrimary disabled={isLoading}>
          Create
        </Button>
        <Button onClick={closeModal} className="ml-2">
          Cancel
        </Button>
      </div>
      {isError && (
        <div className="mt-2 bg-red-200 p-2 rounded border">
          Error creating room.
        </div>
      )}
    </ReactModal>
  );
};
export default CreateRoomModal;
