import React, { useState, useEffect, useCallback } from "react";
import { TableLayout } from "./TableLayout";
import { GiantCard } from "./GiantCard";
import { TopBar } from "./TopBar";
import { SpawnCardModal } from "./SpawnCardModal";
import { SpawnQuestModal } from "./SpawnQuestModal";
import { SideBar } from "./SideBar";
import { Hotkeys } from "./Hotkeys";
import { DropdownMenu } from "./DropdownMenu";

import "../../css/custom-dropdown.css";

import { useSetMousePosition } from "../../contexts/MousePositionContext";

export const Table = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
  setTyping,
  registerDivToArrowsContext
}) => {
  console.log('Rendering Table');
  const [showModal, setShowModal] = useState(null);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [sittingPlayerN, setSittingPlayerN] = useState("");
  // Show/hide group that allows you to browse certain cards in a group
  const [browseGroupId, setBrowseGroupId] = useState("");
  // Indices of stacks in group being browsed
  const [browseGroupTopN, setBrowseGroupTopN] = useState(0);
  const [observingPlayerN, setObservingPlayerN] = useState(playerN);
  const setMousePosition = useSetMousePosition();

  const handleBrowseSelect = (groupId) => {
    setBrowseGroupId(groupId);
    setBrowseGroupTopN("All");
  }

  useEffect(() => {
    const handleMouseDown = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      })
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    }
  })

  return (
    <div className="h-full flex">
      <DropdownMenu
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
      />

      {showHotkeys && <Hotkeys setShowHotkeys={setShowHotkeys}/>}
      {/* Side panel */}
      <SideBar
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
      />
      {/* Main panel */}
      <div className="flex w-full">
        <div className="flex flex-col w-full h-full">
          {/* Game menu bar */}
          <div className="bg-gray-600 text-white" style={{height: "6%"}}>
            <TopBar
              setShowModal={setShowModal}
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
      {showModal === "card" && 
        <SpawnCardModal 
          setTyping={setTyping}
          setShowModal={setShowModal}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
        />
      }
      {showModal === "quest" && 
        <SpawnQuestModal 
          playerN={playerN}
          setTyping={setTyping}
          setShowModal={setShowModal}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
        />
      }
    </div>
  );
})







