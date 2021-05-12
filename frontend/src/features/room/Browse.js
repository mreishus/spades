import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Stacks } from "./Stacks";
import { GROUPSINFO } from "./Constants";
import { ContextMenuTrigger } from "react-contextmenu";
import { handleBrowseTopN } from "./HandleBrowseTopN";
import { GroupContextMenu } from "./GroupContextMenu";
import { getParentCardsInGroup } from "./Helpers";
import { setValues } from "./gameUiSlice";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSetDropdownMenu } from "../../contexts/DropdownMenuContext";
import useLongPress from "../../hooks/useLongPress";

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export const Browse = React.memo(({
  groupId,
  cardSize,
  gameBroadcast,
  chatBroadcast,
  playerN,
  browseGroupTopN,
  setBrowseGroupId,
  setBrowseGroupTopN,
}) => {
  const gameStore = state => state?.gameUi?.game;
  const game = useSelector(gameStore);
  const dispatch = useDispatch();
  const setDropdownMenu = useSetDropdownMenu();
  const group = game["groupById"][groupId];
  const groupType = group["type"];
  const parentCards = getParentCardsInGroup(game, groupId);
  const [selectedCardType, setSelectedCardType] = useState('All');
  const [selectedCardName, setSelectedCardName] = useState('');
  const stackIds = group["stackIds"];
  const numStacks = stackIds.length;

    
  const onLongPress = () => {
    console.log(group);
  };

  const onClick = () => {
    console.log('longpress is triggered');
    const dropdownMenu = {
        type: "group",
        group: group,
        title: GROUPSINFO[groupId].name,
        setBrowseGroupId: setBrowseGroupId,
        setBrowseGroupTopN: setBrowseGroupTopN,
    }
    setDropdownMenu(dropdownMenu);
  }

  const defaultOptions = {
      shouldPreventDefault: true,
      delay: 500,
  };

  const longPress = useLongPress(onLongPress, onClick, defaultOptions);

  // This allows the deck to be hidden instantly upon close (by hiding the top card)
  // rather than waiting to the update from the server
  const stopPeekingTopCard = () => {
    if (numStacks === 0) return null;
    const stackId0 = stackIds[0];
    const cardIds = game["stackById"][stackId0]["cardIds"];
    const cardId0 = cardIds[0];
    const updates = [["game","cardById",cardId0,"peeking",playerN,false]]
    dispatch(setValues({updates: updates})) 
  }

  const handleOptionClick = (event) => {
    setSelectedCardType(event.target.value);
  }

  const handleCloseClick = (_event) => {
    gameBroadcast("game_action", {action: "peek_at", options: {stack_ids: stackIds, value: false}})
    if (groupType === "deck") stopPeekingTopCard();
    setBrowseGroupId("");
  }

  const handleCloseAndShuffleClick = (_event) => {
    gameBroadcast("game_action", {action: "peek_at", options: {stack_ids: stackIds, value: false}})
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: groupId}})
    if (groupType === "deck") stopPeekingTopCard();
    setBrowseGroupId("");
  }

  const handleJustCloseClick = (_event) => {
    setBrowseGroupId("");
  }

  const handleSelectClick = (event) => {
    const topNstr = event.target.value;
    handleBrowseTopN(
      topNstr, 
      group,
      playerN,
      gameBroadcast, 
      chatBroadcast,
      setBrowseGroupId,
      setBrowseGroupTopN
    )
  }

  const handleInputTyping = (event) => {
    setSelectedCardName(event.target.value);
    //setSelectedCardType(event.target.value);
  }

  // If browseGroupTopN not set, or equal to "All" or "None", show all stacks
  var browseGroupTopNint = isNormalInteger(browseGroupTopN) ? parseInt(browseGroupTopN) : numStacks;
  var filteredStackIndices = [...Array(browseGroupTopNint).keys()];
  // Filter by selected card type
  if (selectedCardType != "All") 
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stackIds[s] && 
      parentCards[s]["sides"]["A"]["type"] === selectedCardType &&
      parentCards[s]["peeking"][playerN]
    ));
  console.log(filteredStackIndices)
  // Filter by card name
  if (selectedCardName != "")
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stackIds[s] && 
      parentCards[s]["sides"]["A"]["name"].toLowerCase().includes(selectedCardName.toLowerCase()) &&
      parentCards[s]["peeking"][playerN]
    ));

  return(
    <div className="relative h-full w-full">
      <div
        className="relative text-center h-full text-white float-left select-none opacity-40"
        style={{width:"15px", writingMode:"vertical-rl", paddingLeft: "25px"}} 
      >
        {group.type === "play" ? 
          <div>
            {GROUPSINFO[group.id].tablename}
          </div>
        :
          <div {...longPress}>
            <FontAwesomeIcon className="text-white mb-2 pl-1" icon={faBars}/>
            {GROUPSINFO[group.id].tablename}
          </div>
        }
      </div> 

      <div className="absolute" style={{height:"100%", width:"100%", paddingLeft: "25px"}}>
        <div style={{width:"75%", height:"100%", float:"left"}}>
          <Stacks
            gameBroadcast={gameBroadcast}
            chatBroadcast={chatBroadcast}
            playerN={playerN}
            groupId={groupId}
            stackIds={stackIds}
            cardSize={cardSize}
            groupType={"hand"}
            isCombineEnabled={false}
            selectedStackIndices={filteredStackIndices}
          />
        </div>
        <div style={{width:"25%", height:"100%", float:"left", padding: "10px"}}>
          <div className="absolute right-0">
            <div 
              className="text-white hover:text-red-500 select-none mr-2 border-1"
              onClick={handleCloseClick}
            >
              Stop peeking & close
            </div>
            <div 
              className="text-white hover:text-red-500 select-none mr-2 border-1"
              onClick={handleCloseAndShuffleClick}
            >
              Stop peeking, close & shuffle
            </div>
            <div 
              className="text-white hover:text-red-500 select-none mr-2 border-1"
              onClick={handleJustCloseClick}
            >
              Just close
            </div>
          </div>
          <table style={{width:"100%"}}>
            <body>
              <tr>
                <td onChange={handleSelectClick}>
                  <select name="numFaceup" id="numFaceup">
                    <option value="" disabled selected>Look at...</option>
                    <option value="None">None</option>
                    <option value="All">All</option>
                    <option value="5">Top 5</option>
                    <option value="10">Top 10</option>
                  </select>
                </td>
                <td>
                  <input style={{width:"50%"}} type="text" id="name" name="name" className="ml-5" placeholder="Card name..." onChange={handleInputTyping}></input>
                </td>
              </tr>
              <tr onChange={handleOptionClick}>
                <td><label className="text-white"><input type="radio" name="cardtype" value="All" defaultChecked/> All types</label></td>
                <td><label className="text-white"><input type="radio" name="cardtype" value="Ally"/> Ally</label></td>
              </tr>
              <tr onChange={handleOptionClick}>
                <td><label className="text-white"><input type="radio" name="cardtype" value="Enemy" /> Enemy</label></td>
                <td><label className="text-white"><input type="radio" name="cardtype" value="Attachment" /> Attachment</label></td>
              </tr>
              <tr onChange={handleOptionClick}>
                <td><label className="text-white"><input type="radio" name="cardtype" value="Location" /> Location</label></td>
                <td><label className="text-white"><input type="radio" name="cardtype" value="Event" /> Event</label></td>
              </tr>
              <tr onChange={handleOptionClick}>
                <td><label className="text-white"><input type="radio" name="cardtype" value="Location" /> Treachery</label></td>
                <td><label className="text-white"><input type="radio" name="cardtype" value="Side Quest" /> Side Quest</label></td>
              </tr>
            </body>
          </table> 
        </div>
      </div>
    </div>
  )
})
