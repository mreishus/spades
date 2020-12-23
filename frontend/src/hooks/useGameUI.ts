import { useContext } from "react";
import GameUIContext from "../contexts/GameUIContext";

const useGameUI = () => useContext(GameUIContext);
export default useGameUI;
