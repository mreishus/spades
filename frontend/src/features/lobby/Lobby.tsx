import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import CreateRoomModal from "./CreateRoomModal";
import LobbyTable from "./LobbyTable";
import Button from "../../components/basic/Button";
import Container from "../../components/basic/Container";

import useDataApi from "../../hooks/useDataApi";
import useChannel from "../../hooks/useChannel";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";

interface Props {}

export const Lobby: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();
  const [showModal, setShowModal] = useState(false);
  const { isLoading, isError, data, setData } = useDataApi<any>(
    "/be/api/rooms",
    null
  );

  const onChannelMessage = useCallback(
    (event, payload) => {
      if (event === "rooms_update" && payload.rooms != null) {
        setData({ data: payload.rooms });
      }
    },
    [setData]
  );

  useChannel("lobby:lobby", onChannelMessage);
  const rooms = data != null && data.data != null ? data.data : [];

  return (
    <Container>
      <div>
        <h1 className="mb-4">Lobby</h1>
        {isLoading && <div>Loading..</div>}
        {isError && <div>Error..</div>}
        <LobbyTable rooms={rooms} />
        <div className="mt-4">
          {isLoggedIn && (
            <Button isPrimary onClick={() => setShowModal(true)}>
              Create Room
            </Button>
          )}
          {!isLoggedIn && (
            <span className="text-gray-600 bg-gray-100 border rounded p-2">
              <Link to="/login" className="mr-1">
                Log In
              </Link>
              To Create a Room
            </span>
          )}
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
