import React, { useState } from "react";
import { useSelector } from 'react-redux';

export const SideBarRoundStep = React.memo(({
  playerN,
  phase,
  roundStep, 
  roundStepText,
  gameBroadcast,
  chatBroadcast,
}) => {
  const gameRoundStepStore = state => state?.gameUi?.game?.roundStep;
  const gameRoundStep = useSelector(gameRoundStepStore);
  const triggerRoundStepStore = state => state?.gameUi?.game?.triggerMap?.[roundStep];
  const triggerCardIds = useSelector(triggerRoundStepStore);
  const numTriggers = triggerCardIds ? triggerCardIds.length : 0;
  const [hovering, setHovering] = useState(null);
  const isRoundStep = (gameRoundStep === roundStep);
  const handleButtonClick = (roundStep, roundStepText) => { 
    gameBroadcast("game_action", {action: "update_values", options:{updates: [["game", "roundStep", roundStep], ["game", "phase", phase]]}});     
    chatBroadcast("game_update", {message: "set the round step to "+roundStepText+"."})
  }
  const targetTriggers = () => { 

    // Remove targets from all cards you targeted
    gameBroadcast("game_action", {
        action: "action_on_matching_cards", 
        options: {
            criteria:[["targeting", playerN, true]], 
            action: "update_card_values", 
            options: {updates: [["targeting", playerN, false]]}
        }
    });
    chatBroadcast("game_update", {message: "removes targets."})
    gameBroadcast("game_action", {action: "target_card_ids", options:{card_ids: triggerCardIds}});     
    //chatBroadcast("game_update", {message: "set the round step to "+roundStepText+"."})
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
      {numTriggers > 0 &&
        <div 
          class="absolute rounded-full flex items-center justify-center bg-red-800 hover:bg-red-600 border"
          style={{height:"20px", width:"20px", right:"-17px"}}
          onClick={() => targetTriggers()}
        >
          {numTriggers}
        </div>
      }
      <div className={`flex flex-1 h-full items-center justify-center ${isRoundStep ? "bg-red-800" : "bg-gray-500"} ${hovering ? "block" : "hidden"}`} >
        {roundStepText}
      </div>
    </div>
  )
})