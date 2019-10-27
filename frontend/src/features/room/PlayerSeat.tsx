import React from "react";
import UserSitting from "./UserSitting";
import Button from "../../components/basic/Button";

interface Props {
  seatState: any;
  broadcast: (eventName: string, payload: object) => void;
  whichSeat: string; // north | west | east | south
}

export const PlayerSeat: React.FC<Props> = ({
  seatState,
  broadcast,
  whichSeat
}) => {
  const thisSeat = seatState[whichSeat];
  console.log({ seatState });
  if (thisSeat == null) {
    return <Button onClick={() => broadcast("sit", { whichSeat })}>Sit</Button>;
  } else if (typeof thisSeat == "number") {
    return <UserSitting userId={thisSeat} />;
  } else {
    return <div>Unknown</div>;
  }
};
export default PlayerSeat;
