import React, { useEffect, ReactNode } from "react";
//import PropTypes from "prop-types";
import { Socket } from "phoenix";

import SocketContext from "../contexts/SocketContext";

const SocketProvider = ({
  wsUrl,
  options,
  children
}: {
  wsUrl: string;
  options: object | (() => object);
  children: ReactNode;
}) => {
  console.log({ wsUrl });
  const socket = new Socket(wsUrl, { params: options });
  useEffect(() => {
    console.log("Connecting...");
    socket.connect();
  }, [options, socket, wsUrl]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// SocketProvider.defaultProps = {
//   options: {}
// };

// SocketProvider.propTypes = {
//   wsUrl: PropTypes.string.isRequired,
//   options: PropTypes.object.isRequired
// };

export default SocketProvider;
