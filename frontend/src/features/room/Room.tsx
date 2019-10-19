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
        <div>another div</div>
        <div className="p-2 bg-red-300">{slug}</div>
      </div>
    </Container>
  );
};
export default Room;
