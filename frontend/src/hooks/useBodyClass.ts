// Use body class: Puts a className on the <body> tag of the document.
import { useEffect } from "react";

const addBodyClass = (className: string) =>
  document.body.classList.add(className);
const removeBodyClass = (className: string) =>
  document.body.classList.remove(className);

export default function useBodyClass(className: string | Array<string>) {
  useEffect(() => {
    // Set up
    className instanceof Array
      ? className.map(addBodyClass)
      : addBodyClass(className);

    // Clean up
    return () => {
      className instanceof Array
        ? className.map(removeBodyClass)
        : removeBodyClass(className);
    };
  }, [className]);
}
