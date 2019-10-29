import React, { useCallback } from "react";
import UserContext from "../contexts/UserContext";
import useAuthDataApi from "../hooks/useAuthDataApi";
import useAuth from "../hooks/useAuth";
import { User } from "../hooks/useUser";

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  //const { isLoading, isError, data, doFetchHash: setHash } = useAuthDataApi(
  const { setAuthAndRenewToken } = useAuth();

  const onError = useCallback(() => {
    // If we can't load the profile data, we have stale tokens
    // (remember the useAuthDataApi tries to renew automatically)
    // Forget them and log the user out
    console.log("Error fetching profile info.... Resetting tokens!");
    setAuthAndRenewToken(null, null);
  }, [setAuthAndRenewToken]);

  const { data } = useAuthDataApi("/be/api/v1/profile", null, onError);

  const user: null | User =
    data != null && data.user_profile != null ? data.user_profile : null;
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvider;
