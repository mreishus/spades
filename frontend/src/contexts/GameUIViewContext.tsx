import { createContext } from "react";
import { GameUIView } from "elixir-backend";

const GameUIViewContext = createContext<null | any>(null);
export default GameUIViewContext;
