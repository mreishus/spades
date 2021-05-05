import React, { useState } from "react";
import { TableLayout } from "./TableLayout";
import { GiantCard } from "./GiantCard";
import { TopBar } from "./TopBar";
import { SpawnCardModal } from "./SpawnCardModal";
import { SideBar } from "./SideBar";
import { Hotkeys } from "./Hotkeys";

export const Table = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
  setTyping,
  registerDivToArrowsContext
}) => {
  console.log('Rendering Table');
  const [showSpawn, setShowSpawn] = useState(false);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [sittingPlayerN, setSittingPlayerN] = useState("");
  // Show/hide group that allows you to browse certain cards in a group
  const [browseGroupId, setBrowseGroupId] = useState("");
  // Indices of stacks in group being browsed
  const [browseGroupTopN, setBrowseGroupTopN] = useState(0);
  const [observingPlayerN, setObservingPlayerN] = useState(playerN);

  const handleBrowseSelect = (groupId) => {
    setBrowseGroupId(groupId);
    setBrowseGroupTopN("All");
  }

  return (
    <div className="h-full flex">
      {showHotkeys && <Hotkeys setShowHotkeys={setShowHotkeys}/>}
      {/* Side panel */}
      <SideBar
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
      />
      {/* Main panel */}
      <div className="flex w-full">
        <div className="flex flex-col w-full h-full">
          {/* Game menu bar */}
          <div className="bg-gray-600 text-white" style={{height: "6%"}}>
            <TopBar
              setShowSpawn={setShowSpawn}
              setShowHotkeys={setShowHotkeys}
              handleBrowseSelect={handleBrowseSelect}
              gameBroadcast={gameBroadcast}
              chatBroadcast={chatBroadcast}
              playerN={playerN}
              sittingPlayerN={sittingPlayerN}
              setSittingPlayerN={setSittingPlayerN}
              observingPlayerN={observingPlayerN}
              setObservingPlayerN={setObservingPlayerN}
            />
          </div>
          {/* Table */}
          <div className="" style={{height: "94%"}}>
            <TableLayout
              observingPlayerN={observingPlayerN}
              gameBroadcast={gameBroadcast} 
              chatBroadcast={chatBroadcast}
              playerN={playerN}
              setTyping={setTyping}
              browseGroupId={browseGroupId}
              setBrowseGroupId={setBrowseGroupId}
              browseGroupTopN={browseGroupTopN}
              setBrowseGroupTopN={setBrowseGroupTopN}
              registerDivToArrowsContext={registerDivToArrowsContext}
            />
          </div>
        </div>
      </div>
      {/* Card hover view */}
      <GiantCard playerN={playerN}/>
      {showSpawn && 
        <SpawnCardModal 
          setShowSpawn={setShowSpawn}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
        />
      }
    </div>
  );
})







