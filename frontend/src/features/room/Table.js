import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { faStepBackward, faStepForward, faEquals, faAngleDoubleDown, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import Chat from "../chat/Chat";
import { Group } from "./Group";
import { Browse } from "./Browse";
import { GiantCard } from "./GiantCard";
import { MenuBar } from "./MenuBar";
import styled from "@emotion/styled";
import { GROUPSINFO } from "./Constants"
import Button from "../../components/basic/Button";
import { getDisplayName, getCurrentFace } from "./Helpers"
import ReactModal from "react-modal";
import Dropdown from 'react-dropdown';
import { handleBrowseTopN } from "./HandleBrowseTopN";
import { PlayerBar } from "./PlayerBar";
import { PhaseBar } from "./PhaseBar";
import { setStackIds, setCardIds } from "./gameUiSlice";
import { useMessages } from "../../contexts/MessagesContext";

const cardDB = require('../../cardDB/playringsCardDB.json');

const WidthContainer = styled.div`
  padding: 2px 2px 2px 0.5vw;
  float: left;
  height: 100%;
`;

export const Table = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
  setTyping
}) => {

  //const gameUiStore = state => state.gameUi;
  //const dispatch = useDispatch();
  //const gameUi = useSelector(gameUiStore);
  const [showScratch, setShowScratch] = useState(false);
  const [showSpawn, setShowSpawn] = useState(false);
  const [chatHover, setChatHover] = useState(false);
  const [sittingPlayerN, setSittingPlayerN] = useState("");
  const [spawnFilteredIDs, setSpawnFilteredIDs] = useState(Object.keys(cardDB));
  // Show/hide group that allows you to browse certain cards in a group
  const [browseGroupId, setBrowseGroupId] = useState("");
  // Indices of stacks in group being browsed
  const [browseGroupTopN, setBrowseGroupTopN] = useState(0);
  const [observingPlayerN, setObservingPlayerN] = useState(playerN);

  const messages = useMessages();

  console.log('rendering table');

  const toggleScratch = () => {
    if (showScratch) setShowScratch(false);
    else setShowScratch(true);
  }

  const handleBrowseSelect = (groupId) => {
    setBrowseGroupId(groupId);
    setBrowseGroupTopN("All");
  }

  const handleSpawnTyping = (event) => {
    //setSpawnCardName(event.target.value);
    const filteredName = event.target.value;
    const filteredIDs = []; //Object.keys(cardDB);
    Object.keys(cardDB).map((cardID, index) => {
      const card = cardDB[cardID]
      const sideA = cardDB[cardID]["sides"]["A"]
      const cardName = sideA["name"];
      if (cardName.toLowerCase().includes(filteredName.toLowerCase())) filteredIDs.push(cardID);
    })
    setSpawnFilteredIDs(filteredIDs);
  }

  const handleSpawnClick = (cardID) => {
    const cardRow = cardDB[cardID];
    if (!cardRow) return;
    const loadList = [{'cardRow': cardRow, 'quantity': 1, 'groupId': "sharedStaging"}]
    gameBroadcast("load_cards",{load_list: loadList});
    chatBroadcast("game_update",{message: "spawned "+cardRow["sides"]["A"]["printName"]+"."});
  }

  return (

    <div className="h-full flex">
      <PhaseBar
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
      ></PhaseBar>

      {/* Main panel */}
      <div className="flex w-full">
        <div className="flex flex-col w-full h-full">

          <div className="bg-gray-600 text-white" style={{height: "6%"}}>
            <MenuBar
              setShowSpawn={setShowSpawn}
              handleBrowseSelect={handleBrowseSelect}
              gameBroadcast={gameBroadcast}
              chatBroadcast={chatBroadcast}
              playerN={playerN}
              sittingPlayerN={sittingPlayerN}
              setSittingPlayerN={setSittingPlayerN}
              observingPlayerN={observingPlayerN}
              setObservingPlayerN={setObservingPlayerN}
            ></MenuBar>
          </div>

          <div className=""  style={{height: "94%"}}>

            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <Group
                groupId={'sharedMainQuest'} 
                width="8%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></Group>
              <Group
                groupId={'sharedActive'} 
                width="9%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></Group>
              <div style={{
                width: "68%", 
                height: "100%", 
                backgroundColor: "rgba(0,0,0,0.3)", 
                float: "left",
                MozBoxShadow: '0 10px 10px 5px rgba(0,0,0,0.3)',
                WebkitBoxShadow: '0 10px 10px 5px rgba(0,0,0,0.3)',
                boxShadow: '0 10px 10px 5px rgba(0,0,0,0.3)',
              }}>
                <Group
                  groupId={'sharedStaging'} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupId={browseGroupId}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></Group>
              </div>
              <Group
                groupId={'sharedEncounterDeck'} 
                width="7.5%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></Group>
              <Group
                groupId={'sharedEncounterDiscard'} 
                width="7.5%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></Group>
              
            </div> 
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <Group
                groupId={'player1Engaged'} 
                width="100%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></Group>
            </div>
              
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <Group
                groupId={'player1Play1'} 
                width="100%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></Group>
            </div>
            {browseGroupId ? 
              <div className="flex flex-1 bg-gray-700 border rounded-lg outline-none ml-3 mr-3" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
                <Browse
                  groupId={browseGroupId}
                  width="100%"
                  gameBroadcast={gameBroadcast}
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></Browse>
              </div>
              :
              <div className="flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
                <Group
                  groupId={'player1Play2'} 
                  width="90%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupId={browseGroupId}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></Group>
                <Group
                  groupId={'player1Event'} 
                  width="10%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupId={browseGroupId}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></Group>
              </div>
            }
            <div className="flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <div 
                className=" flex flex-1" 
                style={{
                  width: "75%", 
                  maxWidth: "75%", 
                  minHeight: "100%", 
                  height: "100%", 
                  maxHeight: "100%", 
                  background: "rgba(0, 0, 0, 0.3)",
                  MozBoxShadow: '0 0 10px 5px rgba(0,0,0,0.3)',
                  WebkitBoxShadow: '0 0 10px 5px rgba(0,0,0,0.3)',
                  boxShadow: '0 0 10px 5px rgba(0,0,0,0.3)',
                }}>
                <PlayerBar
                  observingPlayerN={observingPlayerN}
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupId={browseGroupId}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></PlayerBar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GiantCard playerN={playerN}></GiantCard>
      <div 
        className="absolute overflow-hidden" 
        style={{height: chatHover ? "90%" : "18.3%", width: "24.3%", right: "0", bottom: "0", opacity: 0.7, zIndex: 1e6}}
        onMouseEnter={() => setChatHover(true)}
        onMouseLeave={() => setChatHover(false)}
      >
        <Chat chatBroadcast={chatBroadcast} setTyping={setTyping}/>
      </div>
      {/* Right panel
      <div className="flex w-1/5" >
        <div className="flex flex-col w-full h-full">
          
          <div style={{height: "45%"}}>
            <GiantCard playerN={playerN}></GiantCard>
          </div>
          
          <div 
            className="overflow-hidden" 
            style={{height: showScratch ? "12%" : "57%", opacity: 0.7}}
          >
            {gameUi != null && (
              <Chat roomName={gameUi.game_name} chatBroadcast={chatBroadcast} messages={messages} setTyping={setTyping}/>
            )}
          </div>
          
          <div style={{height: "40%", display: showScratch ? "block" : "none"}}>        
            <div style={{height: "33.3%"}}>
              <Group
                  group={groups['sharedExtra1']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></Group>
            </div>      
            <div style={{height: "33.3%"}}>
              <Group
                  group={groups['sharedExtra2']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></Group>
            </div>      
            <div style={{height: "33.3%"}}>
              <Group
                  group={groups['sharedExtra3']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  playerN={playerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupId={setBrowseGroupId}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></Group>
            </div>
          </div>
          <div className="text-center" onClick={() => toggleScratch()} style={{height: "3%"}}>
            <FontAwesomeIcon className="text-white" icon={showScratch ? faChevronDown : faChevronUp}/>
          </div>
        </div>
      </div> */}


      <ReactModal
        closeTimeoutMS={200}
        isOpen={showSpawn}
        onRequestClose={() => setShowSpawn(false)}
        contentLabel="Create New Game"
        overlayClassName="fixed inset-0 bg-black-50 z-10000"
        className="insert-auto overflow-auto p-5 bg-gray-700 border max-w-lg mx-auto my-12 rounded-lg outline-none"
      >
        <h1 className="mb-2">Spawn a card</h1>
        <input style={{width:"50%"}} type="text" id="name" name="name" className="mb-6 mt-5" placeholder=" Card name..." onChange={handleSpawnTyping}></input>
        {(spawnFilteredIDs.length) ? 
          (spawnFilteredIDs.length>15) ?
            <div className="text-white">Too many results</div> :
            <table className="table-fixed rounded-lg w-full">
              <thead>
                <tr className="text-white bg-gray-800">
                  <th className="w-1/2">Name</th>
                  <th className="w-1/2">Set</th>
                </tr>
              </thead>
              {spawnFilteredIDs.map((cardID, index) => {
                const card = cardDB[cardID]
                const sideA = cardDB[cardID]["sides"]["A"]
                const printName = sideA.printName;
                return(
                  <tr className="bg-gray-600 text-white cursor-pointer hover:bg-gray-500 hover:text-black" onClick={() => handleSpawnClick(cardID)}>
                    <td className="p-1">{printName}</td>
                    <td>{card.cardpackname}</td>
                  </tr>
                );
              })}
            </table> :
            <div className="text-white">No results</div>
        }
      </ReactModal>

    </div>

  );
})







