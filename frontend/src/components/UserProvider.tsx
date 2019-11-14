import React, { useCallback } from "react";
import UserContext from "../contexts/UserContext";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const fetchUser = useCallback((id: number) => {
    console.log("****************asked to fetch user id " + id);
  }, []);
  const user = {
    fetchUser
  };
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvider;
