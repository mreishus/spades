import { createContext } from "react";
import { RotateTableContextType } from "elixir-backend";

const RotateTableContext = createContext<RotateTableContextType | null>(null);
export default RotateTableContext;
