import React from "react";
import Table from "./Table";

interface Props {}

let arrow = `/images/cards3/red-arrow-down.png`;
let jack = `/images/cards3/11c.png`;

export const SmartTable: React.FC<Props> = () => {
  return (
    <Table
      bottomCard={jack}
      topCard={jack}
      leftCard={arrow}
      rightCard={arrow}
    />
  );
};
export default SmartTable;
