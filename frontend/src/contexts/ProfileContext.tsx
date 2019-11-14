import { createContext } from "react";
import { Profile } from "elixir-backend";

const ProfileContext = createContext<null | Profile>(null);
export default ProfileContext;
