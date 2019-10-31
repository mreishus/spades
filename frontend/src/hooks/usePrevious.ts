import { useEffect, useRef } from "react";

const usePrevious = <T extends any>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
export default usePrevious;
