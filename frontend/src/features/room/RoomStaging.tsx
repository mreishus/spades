import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {
  gameState: any;
  broadcast: (eventName: string, payload: object) => void;
}

export const RoomStaging: React.FC<Props> = () => {
  return <div>Staging View</div>;
};
export default RoomStaging;
