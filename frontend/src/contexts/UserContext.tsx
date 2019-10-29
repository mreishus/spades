import { createContext } from "react";
import { User } from "../hooks/useUser";

const UserContext = createContext<null | User>(null);
export default UserContext;
