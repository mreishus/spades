import { createContext } from "react";
import { Socket } from "phoenix";
const SocketContext = createContext<Socket | null>(null);
export default SocketContext;
