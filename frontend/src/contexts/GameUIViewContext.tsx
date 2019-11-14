import { createContext } from "react";
import { GameUIView } from "elixir-backend";

const GameUIViewContext = createContext<null | GameUIView>(null);
export default GameUIViewContext;
