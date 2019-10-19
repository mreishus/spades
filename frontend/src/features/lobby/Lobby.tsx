import React, { useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import Button from "../../components/basic/Button";
import Container from "../../components/basic/Container";

interface Props {}

export const Lobby: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Container>
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
    </Container>
  );
};
export default Lobby;
