import React from "react";
import { Link } from "react-router-dom";
import UserSitting from "./UserSitting";
import Button from "../../components/basic/Button";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
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
  const loggedIn = useIsLoggedIn();
  if (userId == null) {
    // Empty Seat
    if (!isWinner) {
      // Empty Seat + Game not over yet
      if (loggedIn) {
        return (
          <Button onClick={() => broadcast("sit", { whichSeat })}>Sit</Button>
        );
      } else {
        return (
          <span className="text-gray-700 bg-gray-100 text-sm border p-1 mt-1 rounded ">
            <Link to="/login" className="mr-1">
              Log In
            </Link>
            to Sit
          </span>
        );
      }
    } else {
      // Empty seat + Game is over
      return null;
    }
  } else if (typeof userId == "number") {
    return <UserSitting userId={userId} />;
  } else {
    return <div>Unknown</div>;
  }
};
export default PlayerSeat;
