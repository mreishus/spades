import React, { useState } from "react";
import { Redirect } from "react-router";
import axios from "axios";
//import cx from "classnames";
import ReactModal from "react-modal";
import Button from "../../components/basic/Button";

import { getRandomInt } from "../../util/util";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

ReactModal.setAppElement("#root");

export const CreateRoomModal: React.FC<Props> = ({ isOpen, closeModal }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomSlugCreated, setRoomSlugCreated] = useState(null);

  const createRoom = async () => {
    console.log("Creating..");
    const name = "Room Name " + getRandomInt(1, 10000);
    const data = { room: { name } };
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await axios.post("/be/api/rooms", data);
      setIsLoading(false);
      if (res.status !== 201) {
        throw new Error("Room not created");
      }
      const room = res.data.data;
      setRoomSlugCreated(room.name);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  if (roomSlugCreated != null) {
    return <Redirect push to={`/room/${roomSlugCreated}`} />;
  }

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
