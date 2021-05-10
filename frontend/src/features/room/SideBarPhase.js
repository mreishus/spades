import React from "react";
import { useSelector } from 'react-redux';
import { SideBarRoundStep } from "./SideBarRoundStep";

export const SideBarPhase = React.memo(({
  playerN,
  phase, 
  text,
  height,
  gameBroadcast,
  chatBroadcast,
  phaseInfo,
}) => {
  const gameRoundStepStore = state => state?.gameUi?.game?.roundStep;
  const gameRoundStep = useSelector(gameRoundStepStore);
  const isPhase = Object.keys(phaseInfo).includes(gameRoundStep);
  return (
    <div 
      className={"relative text-center select-none text-gray-100"}
      style={{height: height, maxHeight: height, borderBottom: (phase === "End") ? "" : "1px solid"}}
    >
      <div
        className={`absolute h-full ${isPhase ? "bg-red-800" : ""}`}
        style={{width:"24px", writingMode:"vertical-rl"}} 
      >
        {text}
      </div>
      <div className="w-full h-full text-sm flex flex-col float-left">
        {Object.keys(phaseInfo).map((roundStep, index) => {
          const roundStepText = phaseInfo[roundStep];
          return (
            <SideBarRoundStep
              playerN={playerN}
              phase={phase}
              roundStep={roundStep}
              roundStepText={roundStepText}
              gameBroadcast={gameBroadcast}
              chatBroadcast={chatBroadcast}
            />
          )
        })}
      </div>
    </div>
  )
})