import React, { useState } from "react";
import { faStepBackward, faStepForward, faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PhaseButton = ({
  phase, 
  text,
  height,
  gameUI, 
  gameBroadcast,
  chatBroadcast,
  phaseInfo,
}) => {
  const [hovering, setHovering] = useState(null);
  const gameRoundStep = gameUI["game"]["round_step"];
  const isPhase = Object.keys(phaseInfo).includes(gameRoundStep);
  const handleButtonClick = (roundStep, roundStepText) => {
    gameBroadcast("set_round_step", {phase: phase, round_step: roundStep})
    chatBroadcast("game_update", {message: "set the round step to "+roundStepText+"."})
  }
  return (
    <div 
      className={"relative text-center select-none text-gray-100"}
      style={{height: height, maxHeight: height, borderBottom: (phase === "pEnd") ? "" : "1px solid"}}
    >
      <div
        className={`absolute h-full ${isPhase ? "bg-red-800" : ""}`}
        style={{width:"24px", writingMode:"vertical-rl"}} 
      >
        {text}
      </div>
      <div
        className="w-full h-full text-sm flex flex-col float-left"
      >
        {Object.keys(phaseInfo).map((roundStep, index) => {
          const isHovering = (hovering === roundStep);
          const isRoundStep = (gameRoundStep === roundStep);
          const roundStepText = phaseInfo[roundStep];
          return(
            <div 
              className={`flex flex-1 items-center`} 
              style={{
                zIndex:1e6, 
                width: isHovering ? "375px" : "100%",
                // MozBoxShadow: '50px 0 10px 5px black',
                // WebkitBoxShadow: '50px 0 10px 5px black',
                // boxShadow: '50px 0 10px 5px black',
              }}
              onClick={() => handleButtonClick(roundStep, roundStepText)}
              onMouseEnter={() => setHovering(roundStep)}
              onMouseLeave={() => setHovering(null)}
            >
              <div className="flex justify-center" style={{width:"24px"}}>
                  
              </div>
              <div className={`flex h-full items-center justify-center ${isRoundStep ? "bg-red-800" : "bg-gray-500"}`} style={{width:"24px"}}>
                {roundStep}
              </div>
              <div className={`flex flex-1 h-full items-center justify-center ${isRoundStep ? "bg-red-800" : "bg-gray-500"} ${isHovering ? "block" : "hidden"}`}>
                {roundStepText}
              </div>
              {/* style={{display: (hovering === roundStep) ? "block" : "none"}} */}
            </div>
          )
        })}
      </div>
    </div>
  )
}