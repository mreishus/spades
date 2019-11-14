import { useContext } from "react";
import GameUIViewContext from "../contexts/GameUIViewContext";

const useGameUIView = () => useContext(GameUIViewContext);
export default useGameUIView;
