// Use body class: Puts a className on the <body> tag of the document.
import { useEffect } from "react";

const addHtmlClass = (className: string) =>
  document.documentElement.classList.add(className);
const removeHtmlClass = (className: string) =>
  document.documentElement.classList.remove(className);

export default function useHtmlClass(className: string | Array<string>) {
  useEffect(() => {
    // Set up
    className instanceof Array
      ? className.map(addHtmlClass)
      : addHtmlClass(className);

    // Clean up
    return () => {
      className instanceof Array
        ? className.map(removeHtmlClass)
        : removeHtmlClass(className);
    };
  }, [className]);
}
