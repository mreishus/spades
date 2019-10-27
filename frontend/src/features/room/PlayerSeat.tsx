import React from "react";
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
  if (thisSeat == null) {
    return <Button onClick={() => broadcast("sit", { whichSeat })}>Sit</Button>;
  }
  return <div>Someone is sitting</div>;
};
export default PlayerSeat;
