import { useContext } from "react";
import ProfileContext from "../contexts/ProfileContext";

export declare class Profile {
  public id: number;
  public email: string;
  public alias: string;
  public inserted_at: string; // Actually contains a timestamp
  public email_confirmed_at: null | string; // Actually contains a timestamp
}

const useProfile = () => useContext(ProfileContext);
export default useProfile;
