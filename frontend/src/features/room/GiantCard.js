import React from "react";
import { useActiveCard } from "../../contexts/ActiveCardContext";
import { getCurrentFaceSRC } from "./CardView";

export const GiantCard = () => {
    const activeCardAndLoc = useActiveCard();
    const activeCard = activeCardAndLoc?.card
    return (
        <div className="h-full" 
            style={{
              backgroundImage: `url(${getCurrentFaceSRC(activeCard,"Player1")})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
        </div>
    )
  }
  
  export default GiantCard;