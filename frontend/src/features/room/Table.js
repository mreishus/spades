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
import { PhaseBar } from "./PhaseBar";

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
  PlayerN,
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
    const topCardNameSource = topOfSourceStack["sides"][topOfSourceStack["current_side"]].printname;

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
      const topCardNameDest = topOfDestStack["sides"][topOfDestStack["current_side"]].printname;
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
      <PhaseBar
        gameUI={gameUI}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
      ></PhaseBar>

      {/* Main panel */}
      <div className="flex w-full">
        <div className="flex flex-col w-full h-full">

          <div className="bg-gray-600 text-white" style={{height: "6%", zIndex: 1e2}}>
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
                group={groups['gSharedMainQuest']} 
                width="8%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gSharedActive']} 
                width="9%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <div style={{
                width: "68%", 
                height: "100%", 
                backgroundColor: "rgba(0,0,0,0.3)", 
                float: "left",
                MozBoxShadow: '0 0 10px 5px rgba(0,0,0,0.3)',
                WebkitBoxShadow: '0 0 10px 5px rgba(0,0,0,0.3)',
                boxShadow: '0 0 10px 5px rgba(0,0,0,0.3)',
              }}>
                <GroupContainer
                  group={groups['gSharedStaging']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  PlayerN={PlayerN}
                  browseGroupID={browseGroupID}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
              </div>
              <GroupContainer
                group={groups['gSharedEncounterDeck']} 
                width="7.5%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gSharedEncounterDiscard']} 
                width="7.5%"
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







