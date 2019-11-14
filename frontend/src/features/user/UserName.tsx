import React, { useEffect } from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";
import useUser from "../../hooks/useUser";

interface Props {
  userId: number | null;
}

export const UserName: React.FC<Props> = ({ userId }) => {
  const users = useUser();

  useEffect(() => {
    users.fetchUser(userId);
  }, [userId, users]);

  if (userId === null) {
    return null;
  }
  console.log("--users");
  console.log(users);
  return <div>user #{userId}</div>;
};
export default UserName;
