import React from "react";
import { GroupContainer } from "./GroupView";

export const PlayerBar = React.memo(({
  groups,
  observingPlayerN,
  gameBroadcast,
  chatBroadcast,
  playerN,
  browseGroupID,
  setBrowseGroupID,
  setBrowseGroupTopN,
}) => {
  return (
    <div className="h-full w-full">
      <GroupContainer
        group={groups['g'+observingPlayerN+'Hand']} 
        width="80%"
        gameBroadcast={gameBroadcast} 
        chatBroadcast={chatBroadcast}
        playerN={playerN}
        browseGroupID={browseGroupID}
        setBrowseGroupID={setBrowseGroupID}
        setBrowseGroupTopN={setBrowseGroupTopN}
      ></GroupContainer>
      <GroupContainer
        group={groups['g'+observingPlayerN+'Deck']} 
        width="10%"
        gameBroadcast={gameBroadcast} 
        chatBroadcast={chatBroadcast}
        playerN={playerN}
        browseGroupID={browseGroupID}
        setBrowseGroupID={setBrowseGroupID}
        setBrowseGroupTopN={setBrowseGroupTopN}
      ></GroupContainer>
      <GroupContainer
        group={groups['g'+observingPlayerN+'Discard']} 
        width="10%"
        gameBroadcast={gameBroadcast} 
        chatBroadcast={chatBroadcast}
        playerN={playerN}
        browseGroupID={browseGroupID}
        setBrowseGroupID={setBrowseGroupID}
        setBrowseGroupTopN={setBrowseGroupTopN}
      ></GroupContainer>
    </div>
  )
})