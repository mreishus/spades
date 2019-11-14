import { createContext } from "react";
import { Profile } from "../hooks/useProfile";

const ProfileContext = createContext<null | Profile>(null);
export default ProfileContext;
