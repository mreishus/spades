import React from "react";
import { SideBarPhase } from "./SideBarPhase";
import { PHASEINFO } from "./Constants";

export const SideBar = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
}) => {
  return(
    <div className="bg-gray-500" style={{width:"48px", zIndex: 1e6}}>
      {PHASEINFO.map((phase, _phaseIndex) => (
        <SideBarPhase
          playerN={playerN}
          phase={phase.name}
          text={phase.label}
          height={phase.height}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
          phaseInfo={phase.steps}
        />
      ))}
    </div>
  )
})
