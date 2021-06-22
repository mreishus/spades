import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Group } from "./Group";
import { Stacks } from "./Stacks";
import { Browse } from "./Browse";
import { GROUPSINFO, CARDSCALE, LAYOUTINFO } from "./Constants";
import Chat from "../chat/Chat";
import { handleBrowseTopN } from "./HandleBrowseTopN"; 
import "../../css/custom-misc.css"; 

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
  const [sideGroupVisible, setSideGroupVisible] = useState(false);
  const [sideGroupId, setSideGroupId] = useState("sharedSetAside");
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

  const quickViewClassName = "w-full cursor-default quickviewbutton"
  const quickViewStyle = {height: "24.5%"}
  const layoutInfo = LAYOUTINFO["layout" + numPlayers + layout];
  const numRows = layoutInfo.length;
  const rowHeight = `${100/numRows}%`; 
  const cardSize = CARDSCALE/numRows;
  var middleRowsWidth = 100;
  if (sideGroupVisible) {
    if (numRows >= 6) middleRowsWidth = 93;
    else middleRowsWidth = 91;
  }

  return (
    <>
      {/* Top row */}
      <div 
        className="relative w-full" 
        style={{height: rowHeight}}>
        {layoutInfo[0].regions.map((region, _regionIndex) => (
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
      </div>
      {/* Middle rows */}
      <div 
        className="relative float-left"
        style={{height: `${100-2*(100/numRows)}%`, width:`${middleRowsWidth}%`}}>
        {layoutInfo.map((row, rowIndex) => {  
          if (browseGroupId && rowIndex === numRows - 2) {
            return(
            <div 
              className="relative bg-gray-700 rounded-lg w-full" 
              style={{height: `${100/(numRows-2)}%`}}
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
            )
          } else if (rowIndex > 0 && rowIndex < numRows - 1) {
            return(
              <div 
                className="relative w-full" 
                style={{height: `${100/(numRows-2)}%`}}>
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
              </div>
            )
          }
        })}
      </div>
      {/* Side Group */}
      {sideGroupVisible && browseGroupId !== sideGroupId &&
        <div className="relative float-left" style={{height: `${100-2*(100/numRows)}%`, width:`${100-middleRowsWidth}%`}}>
          <div className="absolute text-center w-full select-none text-gray-500">
              <div className="mt-1 text-xs">
                {GROUPSINFO[sideGroupId].tablename}
            </div>
          </div>
          <div className="w-full h-full pt-4">
            <Stacks
              gameBroadcast={gameBroadcast}
              chatBroadcast={chatBroadcast}
              playerN={playerN}
              groupId={sideGroupId}
              groupType={"vertical"}
              cardSize={cardSize}
              registerDivToArrowsContext={registerDivToArrowsContext}
            />
          </div>
        </div>
      }
      {/* Bottom row */}
      <div 
        className="relative w-full" 
        style={{height: rowHeight}}>
        {layoutInfo[numRows-1].regions.map((region, _regionIndex) => (
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
      </div>
      {/* Quickview and Chat */}
      <div className="absolute right-0 bottom-0 h-full" style={{width:"25%", height: rowHeight}}>
        <div 
          className="absolute bottom-0 right-0" 
          style={{height: chatHover ? `${numRows*100}%` : `100%`, width:'100%', paddingLeft:"30px", opacity: 0.7, zIndex: 1e6}}
          onMouseEnter={() => handleStartChatHover()}
          onMouseLeave={() => handleStopChatHover()}>
          <Chat chatBroadcast={chatBroadcast} setTyping={setTyping}/>
        </div>
        <div className="absolute h-full text-xs text-center text-gray-400 left-0" style={{width:"30px", background:"rgba(0, 0, 0, 0.3)", zIndex: 1e6+1}}>
          <div className={`quickviewbutton ${sideGroupVisible ? "bg-gray-700" : ""}`} onClick={() => setSideGroupVisible(!sideGroupVisible)}>
            <div style={{height: "50%"}}>SA</div>
            <div style={{height: "50%"}}>{groupById["sharedSetAside"].stackIds.length}</div>
          </div>
          <div className="quickviewbutton" onClick={() => handleBrowseClick(observingPlayerN+"Sideboard")}>
            <div style={{height: "50%"}}>SB</div>
            <div style={{height: "50%"}}>{groupById[observingPlayerN+"Sideboard"]?.stackIds.length}</div>
          </div>
          <div className="quickviewbutton" onClick={() => handleBrowseClick("sharedQuestDeck")}>
            <div style={{height: "50%"}}>QD</div>
            <div style={{height: "50%"}}>{groupById["sharedQuestDeck"].stackIds.length}</div>
          </div>
          <div className="quickviewbutton" onClick={() => handleBrowseClick("sharedVictory")}>
            <div style={{height: "50%"}}>VD</div>
            <div style={{height: "50%"}}>{groupById["sharedVictory"].stackIds.length}</div>
          </div>
        </div>
      </div>
    </>
  )
})