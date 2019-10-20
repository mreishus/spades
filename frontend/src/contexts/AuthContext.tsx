import { createContext, useContext } from "react";

const AuthContext = createContext<any>(false);
export default AuthContext;

export const useAuth = () => useContext(AuthContext);
