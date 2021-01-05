import React from "react";
import { useActiveCard } from "../../contexts/ActiveCardContext";

export const ActiveCard = () => {
    const activeCardAndLoc = useActiveCard();
    const activeCard = activeCardAndLoc?.card
    const currentFace = activeCard?.sides[activeCard?.currentSide]
    return (
        <div className="h-full" 
            style={{
              backgroundImage: `url(${currentFace?.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
        </div>
    )
  }
  
  export default ActiveCard;