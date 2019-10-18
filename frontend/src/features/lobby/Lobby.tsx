import React, { useState } from "react";
//import cx from "classnames";
import CreateRoomModal from "./CreateRoomModal";
import Button from "../../components/basic/Button";

interface Props {}

//export const Lobby: React.FC = ({  }: Props) => {
export const Lobby: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <div>
      this is the lobby
      <div>
        <Button onClick={() => setShowModal(true)}>Create Room</Button>
      </div>
      <CreateRoomModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};
export default Lobby;
