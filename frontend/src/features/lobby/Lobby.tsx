import React, { useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import Button from "../../components/basic/Button";
import Container from "../../components/basic/Container";

import useDataApi from "../../hooks/useDataApi";

interface Props {}

export const Lobby: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { isLoading, isError, data } = useDataApi("/be/api/rooms", null);

  let roomItems = null;
  if (data != null && data.data != null) {
    roomItems = data.data.map((room: any) => (
      <div key={room.id}>
        id {room.id} name {room.name}
      </div>
    ));
  }

  return (
    <Container>
      <div>
        this is the lobby
        {isLoading && <div>Loading..</div>}
        {isError && <div>Error..</div>}
        {roomItems}
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
