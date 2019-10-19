import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";
import Container from "../../components/basic/Container";

interface Props {
  slug: string;
}

export const Room: React.FC<Props> = ({ slug }) => {
  return (
    <Container>
      <div>
        This is a room
        <div className="p-2 bg-purple-300 max-w-md rounded">{slug}</div>
      </div>
    </Container>
  );
};
export default Room;
