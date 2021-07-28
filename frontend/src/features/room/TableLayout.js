import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Group } from "./Group";
import { Stacks } from "./Stacks";
import { Browse } from "./Browse";
import { GROUPSINFO, CARDSCALE, LAYOUTINFO } from "./Constants";
import Chat from "../chat/Chat";
import { handleBrowseTopN } from "./HandleBrowseTopN"; 
import "../../css/custom-misc.css"; 
import useWindowDimensions from "../../hooks/useWindowDimensions";

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
  const [sideGroupId, setSideGroupId] = useState("sharedSetAside");
  const { height, width } = useWindowDimensions();
  const aspectRatio = width/height;

  if (!layout) return;

  const handleQuickViewClick = (groupId) => {
    if (sideGroupId === groupId) setSideGroupId("");
    else setSideGroupId(groupId);
    //handleBrowseTopN("All", groupById[groupId], playerN, gameBroadcast, chatBroadcast, setBrowseGroupId, setBrowseGroupTopN);
  }
  const handleStartChatHover = () => {
    if (delayBroadcast) clearTimeout(delayBroadcast);
    delayBroadcast = setTimeout(function() {
        setChatHover(true);
    }, 1000);
  }
  const handleStopChatHover = () => {
    if (delayBroadcast) clearTimeout(delayBroadcast);
    setChatHover(false);
  }

  const layoutInfo = LAYOUTINFO["layout" + numPlayers + layout];
  const numRows = layoutInfo.length;
  const rowHeight = `${100/numRows}%`; 
  var cardSize = CARDSCALE/numRows;
  if (aspectRatio < 1.9) cardSize = cardSize*(1-0.75*(1.9-aspectRatio));

  var middleRowsWidth = 100;
  if (sideGroupId !== "") {
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
      {Object.keys(GROUPSINFO).includes(sideGroupId) && browseGroupId !== sideGroupId &&
        <div className="relative float-left" style={{height: `${100-2*(100/numRows)}%`, width:`${100-middleRowsWidth}%`}}>
          <div className="absolute text-center w-full select-none text-gray-500">
              <div className="mt-1">
                {GROUPSINFO[sideGroupId].tablename}
            </div>
          </div>
          <div className="w-full h-full mt-4">
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
          className="absolute bottom-0 left-0" 
          style={{height: chatHover ? `${numRows*100}%` : `100%`, width:'100%', paddingRight:"30px", opacity: 0.7, zIndex: chatHover ? 1e6 : 1e3}}
          onMouseEnter={() => handleStartChatHover()}
          onMouseLeave={() => handleStopChatHover()}>
          <Chat hover={chatHover} chatBroadcast={chatBroadcast} setTyping={setTyping}/>
        </div>
        <div className="absolute h-full text-center text-gray-400 right-0 overflow-y-hidden" style={{width:"30px", background:"rgba(0, 0, 0, 0.3)", zIndex: 1e6+1}}>
          <div className={`quickviewbutton ${sideGroupId === "sharedSetAside" ? "bg-gray-700" : ""}`} onClick={() => handleQuickViewClick("sharedSetAside")}>
            <div style={{height: "50%"}}>SA</div>
            <div style={{height: "50%"}}>{groupById["sharedSetAside"].stackIds.length}</div>
          </div>
          <div className={`quickviewbutton ${sideGroupId === observingPlayerN+"Sideboard" ? "bg-gray-700" : ""}`} onClick={() => handleQuickViewClick(observingPlayerN+"Sideboard")}>
            <div style={{height: "50%"}}>SB</div>
            <div style={{height: "50%"}}>{groupById[observingPlayerN+"Sideboard"]?.stackIds.length}</div>
          </div>
          <div className={`quickviewbutton ${sideGroupId === "sharedQuestDeck" ? "bg-gray-700" : ""}`} onClick={() => handleQuickViewClick("sharedQuestDeck")}>
            <div style={{height: "50%"}}>QD</div>
            <div style={{height: "50%"}}>{groupById["sharedQuestDeck"].stackIds.length}</div>
          </div>
          <div className={`quickviewbutton ${sideGroupId === "sharedVictory" ? "bg-gray-700" : ""}`} onClick={() => handleQuickViewClick("sharedVictory")}>
            <div style={{height: "50%"}}>VD</div>
            <div style={{height: "50%"}}>{groupById["sharedVictory"].stackIds.length}</div>
          </div>
        </div>
      </div>
    </>
  )
})