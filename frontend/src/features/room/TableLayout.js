import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Group } from "./Group";
import { Browse } from "./Browse";
import { CARDSCALE, LAYOUTINFO } from "./Constants";
import Chat from "../chat/Chat";

export const TableRegion = React.memo(({
  region,
  cardSize,
  observingPlayerN,
  gameBroadcast,
  chatBroadcast,
  playerN,
  browseGroupId,
  setBrowseGroupId,
  setBrowseGroupTopN,
  registerDivToArrowsContext,
}) => {
  const groupId = ["Hand", "Deck", "Discard"].includes(region.id) ? observingPlayerN + region.id : region.id;
  const beingBrowsed = groupId === browseGroupId;
  return (
    <div
      className="h-full float-left"
      style={{
        width: region.width,
        padding: "0 0 0 0.5vw",
        background: (region.style === "shaded") ? "rgba(0, 0, 0, 0.3)" : "",
        MozBoxShadow: (region.boxShadow) ? '0 10px 10px 5px rgba(0,0,0,0.3)' : "",
        WebkitBoxShadow: (region.boxShadow) ? '0 10px 10px 5px rgba(0,0,0,0.3)' : "",
        boxShadow: (region.boxShadow) ? '0 10px 10px 5px rgba(0,0,0,0.3)' : "",
      }}
    >
      {beingBrowsed ? null :
        <Group
          groupId={groupId}
          cardSize={cardSize}
          gameBroadcast={gameBroadcast} 
          chatBroadcast={chatBroadcast}
          playerN={playerN}
          hideTitle={region.hideTitle}
          browseGroupId={browseGroupId}
          setBrowseGroupId={setBrowseGroupId}
          setBrowseGroupTopN={setBrowseGroupTopN}
          registerDivToArrowsContext={registerDivToArrowsContext}
        />
      }
    </div>
  )
})

export const TableLayout = React.memo(({
  observingPlayerN,
  gameBroadcast,
  chatBroadcast,
  playerN,
  setTyping,
  browseGroupId,
  setBrowseGroupId,
  browseGroupTopN,
  setBrowseGroupTopN,
  registerDivToArrowsContext
}) => {
  console.log("Rendering TableLayout");
  const numPlayersStore = state => state.gameUi.game.numPlayers;
  const numPlayers = useSelector(numPlayersStore);
  const layoutStore = state => state.gameUi?.game?.layout;
  const layout = useSelector(layoutStore);
  const [chatHover, setChatHover] = useState(false);
  if (!layout) return;
  const layoutInfo = LAYOUTINFO["layout" + numPlayers + layout];
  const numRows = layoutInfo.length;
  const rowHeight = `${100/numRows}%`; 
  const cardSize = CARDSCALE/numRows;
  return (
    layoutInfo.map((row, rowIndex) => {
      if (browseGroupId && rowIndex === numRows - 2) {
        return(
        <div 
          className="flex flex-1 bg-gray-700 rounded-lg outline-none w-full" 
          style={{height: rowHeight}}
        >
          <Browse
            groupId={browseGroupId}
            cardSize={cardSize}
            gameBroadcast={gameBroadcast}
            chatBroadcast={chatBroadcast}
            playerN={playerN}
            browseGroupTopN={browseGroupTopN}
            setBrowseGroupId={setBrowseGroupId}
            setBrowseGroupTopN={setBrowseGroupTopN}
          />
          </div>
        )} else {
          return(
          <div 
            className="relative w-full" 
            style={{height: rowHeight}}
          >
            {row.regions.map((region, _regionIndex) => (
              <TableRegion
                region={region}
                cardSize={cardSize}
                observingPlayerN={observingPlayerN}
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
                registerDivToArrowsContext={registerDivToArrowsContext}
              />
            ))}
            {(rowIndex === numRows - 1) &&
              <div 
                className="absolute overflow-hidden" 
                style={{height: chatHover ? `${numRows*100}%` : `100%`, width: "25%", right: "0", bottom: "0", opacity: 0.7, zIndex: 1e6}}
                onMouseEnter={() => setChatHover(true)}
                onMouseLeave={() => setChatHover(false)}
              >
                <Chat chatBroadcast={chatBroadcast} setTyping={setTyping}/>
              </div>
            }
          </div>
          )}
        })
  )
})