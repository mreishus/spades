import React from "react";
import UserName from "../user/UserName";

interface Props {
  userId: number;
}

export const UserSitting: React.FC<Props> = ({ userId }) => {
  return <UserName userId={userId} />;
};
export default UserSitting;
