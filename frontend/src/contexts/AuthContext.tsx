import { createContext } from "react";

interface AuthContextType {
  setAuthAndRenewToken: (
    authTokenData: null | string,
    renewTokenData: null | string
  ) => void;
  authToken: null | string;
  renewToken: null | string;
  logOut: any;
}

const defaultValue: AuthContextType = {
  setAuthAndRenewToken: (_x, _y) => null,
  authToken: null,
  renewToken: null,
  logOut: () => null
};

const AuthContext = createContext<AuthContextType>(defaultValue);
export default AuthContext;
