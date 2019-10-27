import React from "react";

interface Props {
  userId: number;
}

export const UserSitting: React.FC<Props> = ({ userId }) => {
  return <div>user #{userId}</div>;
};
export default UserSitting;
