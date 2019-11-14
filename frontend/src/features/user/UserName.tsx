import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {
  userId: number | null;
}

export const UserName: React.FC<Props> = ({ userId }) => {
  if (userId === null) {
    return null;
  }
  return <div>user #{userId}</div>;
};
export default UserName;
