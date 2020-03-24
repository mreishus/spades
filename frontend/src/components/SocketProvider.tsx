import React, { useEffect, ReactNode } from "react";
import { Socket } from "phoenix";

import SocketContext from "../contexts/SocketContext";

const SocketProvider = ({
  wsUrl,
  options,
  children,
}: {
  wsUrl: string;
  options: object | (() => object);
  children: ReactNode;
}) => {
  const socket = new Socket(wsUrl, { params: options });
  useEffect(() => {
    socket.connect();
  }, [options, socket, wsUrl]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
