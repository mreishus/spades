import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import UserContext from "../contexts/UserContext";

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [usersById, setUsersById] = useState({});

  const { authToken } = useAuth();
  const authOptions = useMemo(
    () => ({
      headers: {
        Authorization: authToken
      }
    }),
    [authToken]
  );

  // user 16
  const fetchUser = useCallback(
    async (id: number) => {
      if (id == null) {
        return;
      }
      console.log("****************asked to fetch user id " + id);
      const url = "/be/api/v1/profile/" + id;
      const result = await axios(url, authOptions);
      console.log("/-/-/-/-/-/-");
      console.log(result.data);
      const { user_profile } = result.data;
      setUsersById(prevState => ({
        ...prevState,
        [id]: user_profile
      }));
    },
    [authOptions, setUsersById]
  );
  const user = {
    fetchUser
  };
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvider;
