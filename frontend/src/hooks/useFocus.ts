import { useRef } from "react";

const useFocus = () => {
    const htmlElRef = useRef<any>(null);
    const setFocus = () => {
        htmlElRef.current?.blur(); 
        return;
    }

    return [ htmlElRef, setFocus ] 
}
  
export default useFocus;