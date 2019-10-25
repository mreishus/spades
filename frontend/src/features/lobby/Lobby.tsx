import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import CreateRoomModal from "./CreateRoomModal";
import Button from "../../components/basic/Button";
import Container from "../../components/basic/Container";

import useDataApi from "../../hooks/useDataApi";
import useChannel from "../../hooks/useChannel";

import { Room } from "elixir-backend";

interface Props {}

export const Lobby: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { isLoading, isError, data, setData } = useDataApi(
    "/be/api/rooms",
    null
  );

  const onChannelMessage = useCallback(
    (event, payload) => {
      console.log("Got channel message", event, payload);
      if (event === "rooms_update" && payload.rooms != null) {
        setData({ data: payload.rooms });
      }
    },
    [setData]
  );
  const broadcast = useChannel("lobby:lobby", onChannelMessage);

  const tdClass = "p-3 border-b border-gray-400";
  const thClass = "p-3 border-b border-gray-400";

  let roomItems = null;
  if (data != null && data.data != null) {
    roomItems = data.data.map((room: Room) => (
      <tr key={room.id}>
        <td className={tdClass}>{room.id}</td>
        <td className={tdClass}>
          <Link to={"/room/" + room.slug}>{room.name}</Link>
        </td>
        <td className={tdClass}>empty</td>
        <td className={tdClass}>empty</td>
        <td className={tdClass}>empty</td>
        <td className={tdClass}>empty</td>
      </tr>
    ));
  }

  return (
    <Container>
      <div>
        <h1 className="mb-4">Lobby</h1>
        {isLoading && <div>Loading..</div>}
        {isError && <div>Error..</div>}
        {roomItems && (
          <table className="shadow rounded border bg-gray-100">
            <thead>
              <tr>
                <th className={thClass}>id</th>
                <th className={thClass}>name</th>
                <th className={thClass}>west</th>
                <th className={thClass}>north</th>
                <th className={thClass}>east</th>
                <th className={thClass}>south</th>
              </tr>
            </thead>
            <tbody>{roomItems}</tbody>
          </table>
        )}
        <div className="mt-4">
          <Button isPrimary onClick={() => setShowModal(true)}>
            Create Room
          </Button>
          <Button
            className="ml-4"
            onClick={() =>
              broadcast("test_message_from_javascript", { stuff: 1 })
            }
          >
            Broadcast
          </Button>
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
