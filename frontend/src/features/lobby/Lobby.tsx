import React, { useState, useCallback } from "react";
import CreateRoomModal from "./CreateRoomModal";
import Button from "../../components/basic/Button";
import Container from "../../components/basic/Container";

import useDataApi from "../../hooks/useDataApi";
import useChannel from "../../hooks/useChannel";

interface Props {}

export const Lobby: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { isLoading, isError, data, setData } = useDataApi(
    "/be/api/rooms",
    null
  );

  const onChannelMessage = useCallback(
    (event, payload) => {
      console.log("Got event and payload from lobby channel");
      console.log(event, payload);
      if (event === "rooms_update" && payload.rooms != null) {
        console.log("Setting data from websocket..");
        setData({ data: payload.rooms });
      }
    },
    [setData]
  );
  useChannel("lobby:lobby", onChannelMessage);

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
