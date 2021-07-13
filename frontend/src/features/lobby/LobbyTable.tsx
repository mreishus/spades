import React from "react";
import UserName from "../user/UserName";
import useProfile from "../../hooks/useProfile";
import { Link } from "react-router-dom";
import { Room } from "elixir-backend";

interface Props {
  rooms: Array<Room>;
}

export const LobbyTable: React.FC<Props> = ({ rooms }) => {
  const myUser = useProfile();
  const tdClass = "p-3 border-b border-gray-400";
  const thClass = "p-3 border-b border-gray-400";
  const currentUnixTime = Math.floor(Date.now() / 1000);

  let roomItems = rooms.map((room: Room) => {
    const elapsedSeconds = (room.last_update ? currentUnixTime - room.last_update : Number.MAX_SAFE_INTEGER);
    const status = (elapsedSeconds < 60 ? "Active" : "Idle");
    if (room.privacy_type === "public" || (room.privacy_type === "playtest" && myUser?.playtester) || myUser?.id === room.created_by) 
      return (
        <tr key={room.id}>
          <td className={tdClass}>
            <Link to={"/room/" + room.slug}>{room.name}</Link>
          </td>
          <td className={tdClass}>
            <UserName userID={room.created_by} />
          </td>
          <td className={tdClass}>
            {room.privacy_type}
          </td>
          <td className={tdClass} style={{color: status === "Active" ? "rgb(5, 150, 105)" : "rgb(185, 28, 28)"}} >
            {status}
          </td>
        </tr>
      )
  });

  if (roomItems.length === 0) {
    return (
      <div className="p-3 text-white rounded bg-gray-700 w-full">
        No rooms created.
      </div>
    );
  }
  return (
    <table className="shadow rounded border bg-gray-100 w-full">
      <thead>
        <tr>
          <th className={thClass}>Room</th>
          <th className={thClass}>Host</th>
          <th className={thClass}>Mode</th>
          <th className={thClass}>Status</th>
        </tr>
      </thead>
      <tbody>{roomItems}</tbody>
    </table>
  );
};
export default LobbyTable;
