import React, { ReactNode } from "react";
import cx from "classnames";

interface Props {
  children: ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  const classes = cx("flex flex-col items-center mx-auto max-w-lg py-2");
  return <div className={classes}>{children}</div>;
};
export default Card;
