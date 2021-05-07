import React, { useState } from "react";
import { useSelector } from 'react-redux';

export const SideBarRoundStep = React.memo(({
  phase,
  roundStep, 
  roundStepText,
  gameBroadcast,
  chatBroadcast,
}) => {
  const gameRoundStepStore = state => state?.gameUi?.game?.roundStep;
  const gameRoundStep = useSelector(gameRoundStepStore);
  const [hovering, setHovering] = useState(null);
  const isRoundStep = (gameRoundStep === roundStep);
  const handleButtonClick = (roundStep, roundStepText) => { 
    gameBroadcast("game_action", {action: "update_values", options:{updates: [["game", "roundStep", roundStep], ["game", "phase", phase]]}});     
    chatBroadcast("game_update", {message: "set the round step to "+roundStepText+"."})
  }
  return (
    <div 
      key={roundStep}
      className={`flex flex-1 items-center`} 
      style={{
        width: hovering ? "375px" : "100%",
      }}
      onClick={() => handleButtonClick(roundStep, roundStepText)}
      onMouseEnter={() => setHovering(roundStep)}
      onMouseLeave={() => setHovering(null)}
    >
      <div className="flex justify-center" style={{width:"24px"}}/>
      <div className={`flex h-full items-center justify-center ${isRoundStep ? "bg-red-800" : "bg-gray-500"}`} style={{width:"24px"}}>
        {roundStep}
      </div>
      <div class="absolute rounded-full h-5 w-5 flex items-center justify-center bg-red-600 border -right-4">3</div>
      <div className={`flex flex-1 h-full items-center justify-center ${isRoundStep ? "bg-red-800" : "bg-gray-500"} ${hovering ? "block" : "hidden"}`} >
        {roundStepText}
      </div>
    </div>
  )
})