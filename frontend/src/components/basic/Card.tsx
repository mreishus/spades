import React, { ReactNode } from "react";
import cx from "classnames";

interface Props {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<Props> = ({ className, children }) => {
  const classes = cx("flex flex-col mx-auto max-w-lg py-2", className);
  return <div className={classes}>{children}</div>;
};
export default Card;
