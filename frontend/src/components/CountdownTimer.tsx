import React, { useState, useCallback, useEffect } from "react";
import cx from "classnames";
import useInterval from "../hooks/useInterval";

interface Props {
  initialSeconds: number;
  className?: string;
}

export const CountdownTimer: React.FC<Props> = ({
  initialSeconds,
  className
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);
  const decrementCount = useCallback(() => {
    setSeconds(this_seconds => Math.max(0, this_seconds - 1));
  }, [setSeconds]);
  useInterval(decrementCount, 1000);
  return <div className={cx(className)}>{seconds}</div>;
};
export default CountdownTimer;
