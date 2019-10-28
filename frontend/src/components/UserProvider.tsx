import React from "react";
import UserContext from "../contexts/UserContext";
import { User } from "../hooks/useUser";

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const user: User = {
    id: 5,
    alias: "Joe52"
  };
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvider;
