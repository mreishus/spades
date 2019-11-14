import React from "react";
import UserSitting from "./UserSitting";
import Button from "../../components/basic/Button";
import { Seat } from "elixir-backend";

interface Props {
  whichSeat: Seat;
  broadcast: (eventName: string, payload: object) => void;
  userId: null | number;
  isWinner?: boolean;
}

export const PlayerSeat: React.FC<Props> = ({
  broadcast,
  userId,
  whichSeat,
  isWinner
}) => {
  if (userId == null) {
    if (!isWinner) {
      return (
        <Button onClick={() => broadcast("sit", { whichSeat })}>Sit</Button>
      );
    } else {
      return null;
    }
  } else if (typeof userId == "number") {
    return <UserSitting userId={userId} />;
  } else {
    return <div>Unknown</div>;
  }
};
export default PlayerSeat;
