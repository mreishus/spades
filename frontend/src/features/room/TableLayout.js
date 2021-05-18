import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Group } from "./Group";
import { Browse } from "./Browse";
import { CARDSCALE, LAYOUTINFO } from "./Constants";
import Chat from "../chat/Chat";
import { handleBrowseTopN } from "./HandleBrowseTopN"; 

var delayBroadcast;

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
  const groupByIdStore = state => state.gameUi.game.groupById;
  const groupById = useSelector(groupByIdStore);
  const layoutStore = state => state.gameUi?.game?.layout;
  const layout = useSelector(layoutStore);
  const [chatHover, setChatHover] = useState(false);
  if (!layout) return;

  const handleBrowseClick = (groupId) => {
    handleBrowseTopN("All", groupById[groupId], playerN, gameBroadcast, chatBroadcast, setBrowseGroupId, setBrowseGroupTopN);
  }
  const handleStartChatHover = () => {
    if (delayBroadcast) clearTimeout(delayBroadcast);
    delayBroadcast = setTimeout(function() {
        setChatHover(true);
    }, 500);
  }
  const handleStopChatHover = () => {
    if (delayBroadcast) clearTimeout(delayBroadcast);
    setChatHover(false);
  }

  const quickViewClassName = "bg-gray-800 hover:bg-gray-600 w-full p-1 cursor-default"
  const quickViewStyle = {height: "25%"}
  const layoutInfo = LAYOUTINFO["layout" + numPlayers + layout];
  const numRows = layoutInfo.length;
  const rowHeight = `${100/numRows}%`; 
  const cardSize = CARDSCALE/numRows;

  return (
    layoutInfo.map((row, rowIndex) => {
      if (browseGroupId && rowIndex === numRows - 2) {
        return(
        <div 
          className="relative bg-gray-700 rounded-lg w-full" 
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
            setTyping={setTyping}
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
            {/* Add buttons and chat to bottom right */}
            {(rowIndex === numRows - 1) &&
              <div className="absolute right-0 bottom-0 h-full" style={{width:"25%"}}>
                <div 
                  className="absolute bottom-0 right-0" 
                  style={{height: chatHover ? `${numRows*100}%` : `100%`, width:'100%', paddingLeft:"30px", opacity: 0.7, zIndex: 1e6}}
                  onMouseEnter={() => handleStartChatHover()}
                  onMouseLeave={() => handleStopChatHover()}
                >
                  <Chat chatBroadcast={chatBroadcast} setTyping={setTyping}/>
                </div>
                <div className="absolute h-full text-xs text-center text-gray-400 left-0" style={{width:"30px", background:"rgba(0, 0, 0, 0.3)", zIndex: 1e6+1}}>
                  <div className={quickViewClassName} style={quickViewStyle} onClick={() => handleBrowseClick("sharedSetAside")}>
                    <div>SA</div>
                    <div>{groupById["sharedSetAside"].stackIds.length}</div>
                  </div>
                  <div className={quickViewClassName} style={quickViewStyle} onClick={() => handleBrowseClick(observingPlayerN+"Sideboard")}>
                    <div>SB</div>
                    <div>{groupById[observingPlayerN+"Sideboard"]?.stackIds.length}</div>
                  </div>
                  <div className={quickViewClassName} style={quickViewStyle} onClick={() => handleBrowseClick("sharedQuestDeck")}>
                    <div>QD</div>
                    <div>{groupById["sharedQuestDeck"].stackIds.length}</div>
                  </div>
                  <div className={quickViewClassName} style={quickViewStyle} onClick={() => handleBrowseClick("sharedVictory")}>
                    <div>VD</div>
                    <div>{groupById["sharedVictory"].stackIds.length}</div>
                  </div>
                </div>
              </div>
            }
          </div>
          )}
        })
  )
})