import { useContext } from "react";
import ProfileContext from "../contexts/ProfileContext";

const useProfile = () => useContext(ProfileContext);
export default useProfile;
