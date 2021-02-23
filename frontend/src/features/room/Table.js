import React, { useState, useEffect, useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { faStepBackward, faStepForward, faEquals, faAngleDoubleDown, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import Chat from "../chat/Chat";
import { GroupContainer } from "./GroupView";
import BrowseContainer from "./Browse";
import { reorderGroups } from "./Reorder";
import { GiantCard } from "./GiantCard";
import { MenuBar } from "./MenuBar";
import styled from "@emotion/styled";
import GameUIContext from "../../contexts/GameUIContext";
import { GROUPSINFO } from "./Constants"
import Button from "../../components/basic/Button";
import { getDisplayName, getCurrentFace } from "./CardView"
import ReactModal from "react-modal";
import Dropdown from 'react-dropdown';
import { handleBrowseTopN } from "./HandleBrowseTopN";
import { PlayerBar } from "./PlayerBar";
import { PhaseButton } from "./PhaseButton";
import { GetPlayerN } from "./GetPlayerN";
import useProfile from "../../hooks/useProfile";

const cardDB = require('../../cardDB/playringsCardDB.json');

const WidthContainer = styled.div`
  padding: 2px 2px 2px 0.5vw;
  float: left;
  height: 100%;
`;

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two', className: 'myOptionClassName' },
  {
   type: 'group', name: 'group1', items: [
     { value: 'three', label: 'Three', className: 'myOptionClassName' },
     { value: 'four', label: 'Four' }
   ]
  },
  {
   type: 'group', name: 'group2', items: [
     { value: 'five', label: 'Five' },
     { value: 'six', label: 'Six' }
   ]
  }
];

export const Table = ({
  gameBroadcast,
  chatBroadcast,
  messages,
  setTyping
}) => {
  const { gameUI, setGameUI } = useContext(GameUIContext);
  const [groups, setGroups] = useState(gameUI.game.groups);
  const [showScratch, setShowScratch] = useState(false);
  const [showSpawn, setShowSpawn] = useState(false);
  const [chatHover, setChatHover] = useState(false);
  const [sittingPlayerN, setSittingPlayerN] = useState("");
  const [spawnFilteredIDs, setSpawnFilteredIDs] = useState(Object.keys(cardDB));
  // Show/hide group that allows you to browse certain cards in a group
  const [browseGroupID, setBrowseGroupID] = useState("");
  // Indices of stacks in group being browsed
  const [browseGroupTopN, setBrowseGroupTopN] = useState(0);
  const [gamePhasePart, setGamePhasePart] = useState(0.0);
  const myUser = useProfile();
  const myUserID = myUser?.id;
  const PlayerN = GetPlayerN(gameUI["player_ids"], myUserID);
  const [observingPlayerN, setObservingPlayerN] = useState(PlayerN);
  //const [selectedFile, setSelectedFile] = useState(null);
  //const activeCard = useActiveCard();
  const defaultGameDropdown = options[0];

  console.log('Rendering groups');

  const toggleScratch = () => {
    if (showScratch) setShowScratch(false);
    else setShowScratch(true);
  }

  const handleBrowseSelect = (groupID) => {
    setBrowseGroupID(groupID);
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
    const loadList = [{'cardRow': cardRow, 'quantity': 1, 'groupID': "gSharedStaging"}]
    gameBroadcast("load_cards",{load_list: loadList});
    chatBroadcast("game_update",{message: "spawned "+cardRow["sides"]["A"]["printname"]+"."});
  }

  // const changePhase = (num) => {
  //   if (num!==phase) setPhase(num);
  // }

  useEffect(() => {
     setGroups(gameUI.game.groups);
  }, [gameUI.game.groups]);

  const onDragEnd = (result) => {
    const source = result.source;
    const sourceStacks = groups[source.droppableId].stacks;
    const sourceStack = sourceStacks[source.index];    
    const topOfSourceStack = sourceStack.cards[0];
    const topCardNameSource = topOfSourceStack["sides"][topOfSourceStack["currentSide"]].printname;

    if (result.combine) {
      const destination = result.combine;
      const destStacks = groups[destination.droppableId].stacks;

      for(var i in destStacks) {
        if(destStacks[i].id == destination.draggableId){
          destination.index = i;
          destStack = destStacks[i];
        }
      }
      if (!destination.index) return;
      var destStack = destStacks[destination.index];
      const topOfDestStack = destStack.cards[0];
      const topCardNameDest = topOfDestStack["sides"][topOfDestStack["currentSide"]].printname;
      // remove from original
      const newDestStackCards = destStack.cards.concat(sourceStack.cards);
      const newDestStack = {
        ...destStack,
        cards: newDestStackCards,
      }
      const newDestStacks = Array.from(destStacks);
      newDestStacks[destination.index] = newDestStack;

      const newSourceStacks = Array.from(source.droppableId === destination.droppableId ? newDestStacks : sourceStacks);
      newSourceStacks.splice(source.index, 1);

      const newGroups = {
        ...groups,
        [destination.droppableId]: {
          ...groups[destination.droppableId],
          stacks: newDestStacks,
        },
        [source.droppableId]: {
          ...groups[source.droppableId],
          stacks: newSourceStacks,
        },
      };
      const newGameUI = {
        ...gameUI,
        game: {
          ...gameUI.game,
          groups: newGroups
        }
      }   
      
      setGroups(newGroups);
      setGameUI(newGameUI);
      gameBroadcast("update_gameui",{gameui: newGameUI});    
      chatBroadcast("game_update",{message: "attached "+getDisplayName(topOfSourceStack)+" from "+GROUPSINFO[source.droppableId].name+" to "+getDisplayName(topOfDestStack)+" in "+GROUPSINFO[destination.droppableId].name+"."})
 

      // const column = state.columns[result.source.droppableId];
      // const withQuoteRemoved = [...column];
      // withQuoteRemoved.splice(result.source.index, 1);
      // const columns = {
      //   ...state.columns,
      //   [result.source.droppableId]: withQuoteRemoved
      // };
      // setState({ columns, ordered: state.ordered });
      // return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const data = reorderGroups({
      groups: groups,
      source,
      destination
    });

    const newGameUI = {
      ...gameUI,
      "game": {
        ...gameUI.game,
        "groups": data.groups
      }
    }   
    setGroups(data.groups)
    setGameUI(newGameUI)
    //setGroups(newGroups);
    gameBroadcast("move_stack",{
      orig_group_id: source.droppableId, 
      orig_stack_index: source.index, 
      dest_group_id: destination.droppableId, 
      dest_stack_index: destination.index,
      preserve_state: false,
    });
    const sourceGroupTitle = GROUPSINFO[source.droppableId].name;
    const destGroupTitle = GROUPSINFO[destination.droppableId].name;
    if (sourceGroupTitle != destGroupTitle) chatBroadcast("game_update",{message: "moved "+getDisplayName(topOfSourceStack)+" from "+sourceGroupTitle+" to "+destGroupTitle+"."})
    //gameBroadcast("update_gameui",{gameui: newGameUI});


    // setGroups(data.groups);
    // // gameBroadcast(
    // //   "update_2_groups",
    // //   {
    // //     groupID1: source.droppableId,
    // //     groupIndex1: data.groups[source.droppableId],
    // //     groupID2: destination.droppableId,
    // //     groupIndex2: data.groups[destination.droppableId],
    // // })
    // setState({
    //   columns: data.quoteMap,
    //   ordered: state.ordered
    // });
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
    <div className="h-full flex">
      {/* Right panel */}
      <div className="bg-gray-500" style={{width:"48px"}}>
        <PhaseButton
          phase={"α"}
          height={"4.5%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "0.0": "Round starts",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Resource"}
          height={"13%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "1.1": "Phase starts",
            "1.R": "1.2 & 1.3: Gain resources and draw cards",
            "1.4": "Phase ends",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Planning"}
          height={"13%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "2.1": "Phase starts",
            "2.P": "2.2 & 2.3: Play cards in turn order",
            "2.4": "Phase ends",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Quest"}
          height={"13%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "3.1": "Phase starts",
            "3.2": "Commit characters",
            "3.3": "Staging",
            "3.4": "Quest resolution",
            "3.5": "Phase ends",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Travel"}
          height={"13%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "4.1": "Phase starts",
            "4.2": "Travel opportunity",
            "4.3": "Phase ends",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Encounter"}
          height={"13%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "5.1": "Phase starts",
            "5.2": "Optional Engagement",
            "5.3": "Engagement checks",
            "5.4": "Phase ends",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Combat"}
          height={"13%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "6.1": "Phase starts",
            "6.2": "Shadow cards",
            "6.E": "6.3-6.6: Enemy attacks",
            "6.P": "6.7-6.10: Player attacks",
            "6.11": "Phase ends",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Refresh"}
          height={"13%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "7.1": "Phase starts",
            "7.R": "7.2 & 7.3: Ready all cards, raise threat, pass 1st player token",
            "7.3": "Phase ends",
          }}
        ></PhaseButton>
        <PhaseButton
          phase={"Ω"}
          height={"4.5%"}
          gamePhasePart={gamePhasePart}
          setGamePhasePart={setGamePhasePart}
          phaseInfo={{
            "0.1": "Round ends",
          }}
        ></PhaseButton>
        {/* <div 
          className={`flex flex-1 text-center select-none text-gray-100 ${(phase===7) ? "bg-gray-600" : ""}`}
        >
          <div
            className={`w-1/2 ${(Math.floor(phase)===7) ? "bg-gray-600" : ""}`}
            style={{writingMode:"vertical-rl"}} 
          >
            Refresh
          </div>
          <div
            className="w-1/2"
          >
            <div className={`flex h-1/3 items-center justify-center ${(phase===7.3) ? "bg-gray-600" : ""}`} onClick={() => changePhase(7.3)}><FontAwesomeIcon className="fa-rotate-90" icon={faStepBackward}/></div>
            <div className={`flex h-1/3 items-center justify-center ${(phase===7.2) ? "bg-gray-600" : ""}`} onClick={() => changePhase(7.2)}><FontAwesomeIcon className="" icon={faEquals}/></div>
            <div className={`flex h-1/3 items-center justify-center ${(phase===7.1) ? "bg-gray-600" : ""}`} onClick={() => changePhase(7.1)}><FontAwesomeIcon className="fa-rotate-90" icon={faStepForward}/></div>
          </div>
        </div> */}
        {/* <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===6) ? "bg-gray-600" : ""}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(6)}>Combat</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===5) ? "bg-gray-600" : ""}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(5)}>Encounter</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===4) ? "bg-gray-600" : ""}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(4)}>Travel</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===3) ? "bg-gray-600" : ""}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(3)}>Quest</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===2) ? "bg-gray-600" : ""}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(2)}>Planning</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===1) ? "bg-gray-600" : ""}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(1)}>Resource</div> */}
        {/* <div 
          className={`flex text-center p-1 select-none ${(gamePhase==="End") ? "bg-gray-600" : ""}`}
          onClick={() => setGamePhase("End")}>End</div>*/}
      </div> 



      {/* Main panel */}
      <div className="flex w-full">
        <div className="flex flex-col w-full h-full">

          <div className="bg-gray-600 text-white" style={{height: "6%"}}>
            <MenuBar
              gameUI={gameUI}
              setShowSpawn={setShowSpawn}
              handleBrowseSelect={handleBrowseSelect}
              gameBroadcast={gameBroadcast}
              chatBroadcast={chatBroadcast}
              PlayerN={PlayerN}
              sittingPlayerN={sittingPlayerN}
              setSittingPlayerN={setSittingPlayerN}
              observingPlayerN={observingPlayerN}
              setObservingPlayerN={setObservingPlayerN}
            ></MenuBar>
          </div>

          <div className=""  style={{height: "94%"}}>

            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
            <GroupContainer
                group={groups['gSharedStaging']} 
                width="75%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gSharedActive']} 
                width="10%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gSharedMainQuest']} 
                width="15%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              
            </div> 
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <GroupContainer
                group={groups['gPlayer1Engaged']} 
                width="100%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
            </div>
              
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <GroupContainer
                group={groups['gPlayer1Play1']} 
                width="100%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
            </div>

            {browseGroupID ? 
              <div className="flex flex-1 bg-gray-700 border rounded-lg outline-none ml-3 mr-3" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
                <BrowseContainer
                  group={groups[browseGroupID]}
                  gameBroadcast={gameBroadcast}
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                  playerIDs={gameUI["player_ids"]}
                ></BrowseContainer>
              </div>
              :
              <div className="flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
                <GroupContainer
                  group={groups['gPlayer1Play2']} 
                  width="90%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupID={browseGroupID}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
                <GroupContainer
                  group={groups['gPlayer1Event']} 
                  width="10%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupID={browseGroupID}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
              </div>
            }
            <div className="flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <div className=" flex flex-1" style={{width: "75%", maxWidth: "75%", minHeight: "100%", height: "100%", maxHeight: "100%", background: "rgba(0, 0, 0, 0.5)"}}>
                <PlayerBar
                  groups={groups}
                  observingPlayerN={observingPlayerN}
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupID={browseGroupID}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></PlayerBar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GiantCard PlayerN={PlayerN}></GiantCard>
      <div 
        className="absolute overflow-hidden" 
        style={{height: chatHover ? "90%" : "18.5%", width: "24.3%", right: "0", bottom: "0", opacity: 0.7, zIndex: 1e6}}
        onMouseEnter={() => setChatHover(true)}
        onMouseLeave={() => setChatHover(false)}
      >
        {gameUI != null && (
          <Chat roomName={gameUI.game_name} chatBroadcast={chatBroadcast} messages={messages} setTyping={setTyping}/>
        )}
      </div>
      {/* Right panel
      <div className="flex w-1/5" >
        <div className="flex flex-col w-full h-full">
          
          <div style={{height: "45%"}}>
            <GiantCard PlayerN={PlayerN}></GiantCard>
          </div>
          
          <div 
            className="overflow-hidden" 
            style={{height: showScratch ? "12%" : "57%", opacity: 0.7}}
          >
            {gameUI != null && (
              <Chat roomName={gameUI.game_name} chatBroadcast={chatBroadcast} messages={messages} setTyping={setTyping}/>
            )}
          </div>
          
          <div style={{height: "40%", display: showScratch ? "block" : "none"}}>        
            <div style={{height: "33.3%"}}>
              <GroupContainer
                  group={groups['gSharedExtra1']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
            </div>      
            <div style={{height: "33.3%"}}>
              <GroupContainer
                  group={groups['gSharedExtra2']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
            </div>      
            <div style={{height: "33.3%"}}>
              <GroupContainer
                  group={groups['gSharedExtra3']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
            </div>
          </div>
          <div className="text-center" onClick={() => toggleScratch()} style={{height: "3%"}}>
            <FontAwesomeIcon className="text-white" icon={showScratch ? faChevronDown : faChevronUp}/>
          </div>
        </div>
      </div> */}
    </div>

    {/* <ReactModal
      closeTimeoutMS={200}
      isOpen={showSpawn}
      onRequestClose={() => setShowSpawn(false)}
      contentLabel="Spawn a card"
      overlayClassName="fixed inset-0 bg-black-0 z-50"
      className="insert-auto overflow-auto p-5 bg-gray-700 border rounded-lg outline-none"
      style={{  content : {
        height: "60%",
        width: "40%",
        marginTop:"20%",
        zindex:1e9,
      }}}
    >
      <div style={{height: "25vh",zIndex:1e7,backgroundColor:"red"}}>
      </div>
    </ReactModal> */}

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
              const printName = sideA.printname;
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

    {/* <Draggable>
      <div style={{height:"200px",width:"800px",top:"0px",left:"0px",position:"relative",backgroundColor:"red",zIndex:1e7}}>
        <GroupView group={groups['gSharedExtra1']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}
        PlayerN={PlayerN} showTitle="false"></GroupView>
      </div>
    </Draggable> */}



    </DragDropContext>

  );
}

export default Table;







