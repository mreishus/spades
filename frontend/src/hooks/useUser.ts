import { useContext } from "react";
import UserContext from "../contexts/UserContext";

export declare class User {
  public id: number;
  public alias: string;
}

const useUser = () => useContext(UserContext);
export default useUser;
