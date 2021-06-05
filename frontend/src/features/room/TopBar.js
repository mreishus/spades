import React from "react";
import { TopBarMenu } from "./TopBarMenu";
import { TopBarView } from "./TopBarView";
import { TopBarDataContainer } from "./TopBarDataContainer";

export const TopBar = React.memo(({
  setShowModal,
  setShowHotkeys,
  handleBrowseSelect,
  gameBroadcast,
  chatBroadcast,
  playerN,
  observingPlayerN,
  setObservingPlayerN,
}) => {
  console.log("rendering TopBar");
  return(
    <div className="h-full">
      <ul className="top-level-menu float-left">
        <TopBarMenu
          setShowModal={setShowModal}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
          playerN={playerN}
        />
        <TopBarView
          setShowHotkeys={setShowHotkeys}
          handleBrowseSelect={handleBrowseSelect}
          playerN={playerN}
        />
      </ul>
      <TopBarDataContainer
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      />
    </div>
  )
})