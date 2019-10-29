import { useContext } from "react";
import UserContext from "../contexts/UserContext";

export declare class User {
  public id: number;
  public email: string;
  public alias: string;
  public inserted_at: string; // Actually contains a timestamp
  public email_confirmed_at: null | string; // Actually contains a timestamp
}

const useUser = () => useContext(UserContext);
export default useUser;
