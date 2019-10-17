import { Socket } from "phoenix";
import { createContext } from "react";
const SocketContext = createContext<Socket | null>(null);
export default SocketContext;
