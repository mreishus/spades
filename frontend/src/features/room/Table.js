import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import Chat from "../chat/Chat";
import { GroupContainer } from "./GroupView";
import BrowseContainer from "./Browse";
import { reorderGroups } from "./Reorder";
import { GiantCard } from "./GiantCard";
import styled from "@emotion/styled";
import GameUIContext from "../../contexts/GameUIContext";
import { GROUPSINFO } from "./Constants"
import Button from "../../components/basic/Button";
import { getDisplayName, getCurrentFace } from "./CardView"
import ReactModal from "react-modal";
import Dropdown from 'react-dropdown';

const cardDB = require('../../cardDB/playringsCardDB.json');

const WidthContainer = styled.div`
  padding: 2px 2px 2px 0.5vw;
  float: left;
  height: 100%;
`;

export const sectionToGroupID = (section, PlayerN) => {
  switch(section) {
    case 'Hero':
      return 'g'+PlayerN+'Play1';
    case 'Ally':
      return 'g'+PlayerN+'Deck';
    case 'Attachment':
      return 'g'+PlayerN+'Deck';
    case 'Event':
      return 'g'+PlayerN+'Deck';
    case 'Side Quest':
      return 'g'+PlayerN+'Deck';
    case 'Sideboard':
      return 'g'+PlayerN+'Sideboard';
    case 'Quest':
      return 'gSharedQuestDeck';
    case 'Encounter':
      return 'gSharedEncounterDeck';
    case 'Special':
      return 'gSharedEncounterDeck2';
    case 'Second Special':
      return 'gSharedEncounterDeck3';
    case 'Setup':
      return 'gSharedSetAside';
    case 'Staging Setup':
      return 'gSharedStaging';
    case 'Active Setup':
      return 'gSharedActive';
    case 'Second Quest Deck':
      return 'gSharedQuestDeck2';
  }
  return 'gSharedOther';
}

export const sectionToDiscardGroupID = (section, PlayerN) => {
  switch(section) {
    case 'Hero':
      return 'g'+PlayerN+'Discard';
    case 'Ally':
      return 'g'+PlayerN+'Discard';
    case 'Attachment':
      return 'g'+PlayerN+'Discard';
    case 'Event':
      return 'g'+PlayerN+'Discard';
    case 'Side Quest':
      return 'g'+PlayerN+'Discard';
    case 'Sideboard':
      return 'g'+PlayerN+'Discard';
    case 'Quest':
      return 'gSharedQuestDiscard';
    case 'Encounter':
      return 'gSharedEncounterDiscard';
    case 'Special':
      return 'gSharedEncounterDiscard2';
    case 'Second Special':
      return 'gSharedEncounterDiscard3';
    case 'Setup':
      return 'gSharedEncounterDiscard';
    case 'Staging Setup':
      return 'gSharedEncounterDiscard';
    case 'Active Setup':
      return 'gSharedEncounterDiscard';
    case 'Second Quest Deck':
      return 'gSharedQuestDiscard2';
  }
  return 'gSharedOther';
}

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
  const [spawnCardName, setSpawnCardName] = useState("");
  const [spawnFilteredIDs, setSpawnFilteredIDs] = useState(Object.keys(cardDB));
  // Show/hide group that allows you to browse certain cards in a group
  const [browseGroupID, setBrowseGroupID] = useState("");
  // Indices of stacks in group being browsed
  const [browseGroupTopN, setBrowseGroupTopN] = useState(0);
  const [phase, setPhase] = useState(1);
  //const [selectedFile, setSelectedFile] = useState(null);
  //const activeCard = useActiveCard();
  const defaultGameDropdown = options[0];

  const sumStagingThreat = () => {
    const stagingStacks = gameUI["game"]["groups"]["gSharedStaging"]["stacks"];
    var stagingThreat = 0;
    stagingStacks.forEach(stack => {
      const currentFace = getCurrentFace(stack["cards"][0]);
      stagingThreat = stagingThreat + currentFace["threat"];
    })
    return stagingThreat;
  }

  const inputFile = useRef(null) 
  console.log('Rendering groups');

  const handleMenuClick = (data) => {
    console.log(data);
    if (data.action === "reset_game") {
      gameBroadcast("reset_game",{});
      chatBroadcast("game_update",{message: "reset the game."});
    } else if (data.action === "load_deck") {
      loadDeckFile();
    } else if (data.action === "spawn_card") {
      setShowSpawn(true);
    } else if (data.action === "look_at") {
      handleBrowseSelect(data.groupID);
    }
  }
  
  const toggleScratch = () => {
    if (showScratch) setShowScratch(false);
    else setShowScratch(true);
  }

  const handleBrowseSelect = (groupID) => {
    setBrowseGroupID(groupID);
    setBrowseGroupTopN(0);
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

  const changePhase = (num) => {
    if (num!==phase) setPhase(num);
  }

  useEffect(() => {
     setGroups(gameUI.game.groups);
  }, [gameUI.game.groups]);

  const resetGame = () => {
    gameBroadcast("reset_game",{});
    chatBroadcast("game_update",{message: "reset the game."});
  }
  
  const loadDeckFile = () => {
    inputFile.current.click();
  }
  const loadDeck = async(event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (event) => { 
      const xmltext = (event.target.result)
      //console.log(xmltext)
      var parseString = require('xml2js').parseString;
      parseString(xmltext, function (err, deckJSON) {
        console.dir(deckJSON);
        console.log(deckJSON.deck.section);
        const sections = deckJSON.deck.section;
        var loadList = [];
        sections.forEach(section => {
          const sectionName = section['$'].name;
          console.log(sectionName);
          const cards = section.card;
          if (!cards) return;
          cards.forEach(card => {
            const cardid = card['$'].id;
            const quantity = parseInt(card['$'].qty);
            var cardRow = cardDB[cardid];
            cardRow['discardgroupid'] = sectionToDiscardGroupID(sectionName,'Player1');
            console.log(cardRow);
            if (cardRow) {
              loadList.push({'cardRow': cardRow, 'quantity': quantity, 'groupID': sectionToGroupID(sectionName,'Player1')})
            }
              //console.log('thiscard', cardRow);
          })
        })
        console.log(loadList);
        gameBroadcast("load_cards",{load_list: loadList});
        chatBroadcast("game_update",{message: "loaded a deck."});
      })
    }
    reader.readAsText(event.target.files[0]);
  }
  

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
    <div className="flex flex-1 h-full">
      {/* Right panel */}
      <div className="flex flex-col w-8">
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===7) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(7)}>Refresh</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===6) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(6)}>Combat</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===5) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(5)}>Encounter</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===4) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(4)}>Travel</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===3) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(3)}>Quest</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===2) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(2)}>Planning</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase===1) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(1)}>Resource</div>
      </div>



      {/* Middle panel */}
      <div className="flex w-4/5">
        <div className="flex flex-col w-full h-full">

          <span className="bg-gray-300" style={{height: "6%"}}>

            <ul class="top-level-menu float-left">
              <li><a href="#">Menu</a>
                  <ul class="second-level-menu">
                    <li>
                      <a  onClick={() => handleMenuClick({action:"load_deck"})} href="#">Load Deck</a>
                      <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={loadDeck}/>
                    </li>
                    <li><a  onClick={() => handleMenuClick({action:"spawn_card"})} href="#">Spawn Card</a></li>
                    <li>
                        <a href="#">Reset Game</a>
                        <ul class="third-level-menu">
                            <li><a onClick={() => handleMenuClick({action:"reset_game"})} href="#">Confirm</a></li>
                        </ul>
                    </li>
                  </ul>
              </li>
              <li>
                <a href="#">Look at...</a>
                <ul class="second-level-menu">
                    <li>
                        <a href="#">Shared</a>
                        <ul class="third-level-menu">
                          {Object.keys(GROUPSINFO).map((groupID, index) => {
                            if (groupID.substring(0,7) === "gShared")
                              return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                            else return null;
                          })}
                        </ul>
                    </li>
                    <li>
                        <a href="#">Player 1</a>
                          <ul class="third-level-menu">
                            {Object.keys(GROUPSINFO).map((groupID, index) => {
                              if (groupID.substring(0,8) === "gPlayer1")
                                return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                              else return null;
                            })}
                          </ul>
                    </li>
                    <li>
                        <a href="#">Player 2</a>
                        <ul class="third-level-menu">
                            {Object.keys(GROUPSINFO).map((groupID, index) => {
                              if (groupID.substring(0,8) === "gPlayer2")
                                return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                              else return null;
                            })}
                        </ul>
                    </li>
                    <li>
                        <a href="#">Player 3</a>
                        <ul class="third-level-menu">
                            {Object.keys(GROUPSINFO).map((groupID, index) => {
                              if (groupID.substring(0,8) === "gPlayer3")
                                return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                              else return null;
                            })}
                        </ul>
                    </li>
                    <li>
                        <a href="#">Player 4</a>
                        <ul class="third-level-menu">
                            {Object.keys(GROUPSINFO).map((groupID, index) => {
                              if (groupID.substring(0,8) === "gPlayer4")
                                return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                              else return null;
                            })}
                        </ul>
                    </li>
                </ul>
              </li>
            </ul>
            <div className="float-left h-full" style={{backgroundColor:"red", width: "15%"}}>
              <div class="float-left h-full w-1/3 bg-green-500">
                <div class="h-1/2 w-full bg-red-500 flex justify-center">
                  Round
                </div>
                <div class="h-1/2 w-full bg-red-800 flex justify-center">
                  <div class="text-xl">{gameUI["game"]["round_number"]}</div>
                  <img class="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/time.png'}></img>
                </div>
              </div>
              <div class="float-left h-full w-1/3 bg-green-500">
                <div class="h-1/2 w-full bg-red-500 flex justify-center">
                  Threat
                </div>
                <div class="h-1/2 w-full bg-red-800 flex justify-center">
                  <div class="text-xl">{sumStagingThreat()}</div>
                  <img class="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/threat.png'}></img>
                </div>
              </div>
              <div class="float-left h-full w-1/3 bg-green-500">
                <div class="h-1/2 w-full bg-red-500 flex justify-center">
                  Progress
                </div>
                <div class="h-1/2 w-full bg-red-800 flex justify-center">
                  <div class="text-xl">{gameUI["game"]["round_number"]}</div>
                  <img class="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/progress.png'}></img>
                </div>
              </div>
            


              {/* <table className="table-fixed h-full w-full max-h-full">
                  <tr className="bg-red-800 h-1/2 hover:bg-red-600 truncate">
                    <td className="w-1/3 text-center">Round</td>
                    <td className="w-1/3 text-center overflow-clip">Staging</td>
                    <td className="w-1/3 text-center overflow-clip">Net</td>
                  </tr>
                  <tr className="bg-red-800 h-1/2 hover:bg-red-600 truncate">
                    <td className="w-1/3 text-center overflow-clip">
                      <div class="text-l">{gameUI["game"]["round_number"]}</div>
                    </td>
                    <td className="w-1/3 text-center truncate">Staging</td>
                    <td className="w-1/3 text-center">Net</td>
                  </tr>
              </table> */}

              {/* <div class="float-left h-full w-1/3 bg-green-500 flex justify-center">
                <div class="text-xl">{gameUI["game"]["round_number"]}</div>
                <img class="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/time.png'}></img>
              </div>
              <div class="float-left h-full w-1/3 bg-green-500 flex justify-center">
                <div class="text-xl">{gameUI["game"]["round_number"]}</div>
                <img class="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/threat.png'}></img>
              </div>
              <div class="float-left h-full w-1/3 bg-green-500 flex justify-center">
                <div class="text-xl">{gameUI["game"]["round_number"]}</div>
                <img class="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/progress.png'}></img>
              </div> */}
            </div>
            <div class="float-left h-full" style={{backgroundColor:"blue", width: "15%"}}>
              <div class="float-left h-full w-1/3 bg-green-500 flex justify-center">
                <div class="text-xl">{gameUI["game"]["round_number"]}</div>
                <img class="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/progress.png'}></img>
              </div>
              P1: Seastan
              [T]: {gameUI["game"]["players"]["Player1"]["threat"]}
              [W]: {gameUI["game"]["players"]["Player1"]["willpower"]}
            </div>
            <div class="float-left h-full" style={{backgroundColor:"green", width: "15%"}}>
              P1: [Sit]
              [T]: {gameUI["game"]["players"]["Player2"]["threat"]}
              [W]: {gameUI["game"]["players"]["Player2"]["willpower"]}
            </div>
            <div class="float-left h-full" style={{backgroundColor:"orange", width: "15%"}}>
              P1: [Sit]
              [T]: {gameUI["game"]["players"]["Player3"]["threat"]}
              [W]: {gameUI["game"]["players"]["Player3"]["willpower"]}
            </div>
            <div class="float-left h-fullP" style={{backgroundColor:"yellow", width: "15%"}}>
              P1: [Sit]
              [T]: {gameUI["game"]["players"]["Player4"]["threat"]}
              [W]: {gameUI["game"]["players"]["Player4"]["willpower"]}
            </div>
            {/* <ContextMenuTrigger id="main-menu" holdToDisplay={0}>
              <div className="w-1/12 float-left bg-gray-700 hover:bg-gray-600 text-white cursor-pointer text-center">
                Menu
              </div>
            </ContextMenuTrigger> 

            <ContextMenu id="main-menu" style={{zIndex:1e6}}>
              <hr></hr>
              <MenuItem onClick={handleMenuClick} data={{action: 'load_deck'}}>Load deck</MenuItem>
              <MenuItem onClick={handleMenuClick} data={{action: 'spawn_card'}}>Spawn card</MenuItem>
              <SubMenu title='Reset game'>
                <MenuItem onClick={handleMenuClick} data={{action: 'reset_game'}}>Confirm</MenuItem>
              </SubMenu>
            </ContextMenu>


            <select className="bg-gray-700 appearance-none text-white text-center w-1/12 hover:bg-gray-600"  name="numFaceup" id="numFaceup" onChange={handleBrowseSelect}>
              <option value="" disabled selected>Look at...</option>
              {Object.keys(GROUPSINFO).map((groupID, index) => {
                return(<option value={groupID}>{GROUPSINFO[groupID].name}</option>)
              })}
            </select> */}
            
          </span>

          {/* <div className="bg-gray-200" style={{height: "3%"}}>
            <select name="num_players" id="num_players">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            player(s)
            Threat: {gameUI["game"]["players"]["Player1"]["threat"]}
          </div> */}

          <div className=""  style={{height: "94%"}}>

            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
            <GroupContainer
                group={groups['gSharedStaging']} 
                width="75%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gSharedActive']} 
                width="10%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gSharedMainQuest']} 
                width="15%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
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
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
            </div>

            {browseGroupID ? 
              <div className="flex flex-1 bg-gray-700 border rounded-lg outline-none ml-3 mr-3" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
                <BrowseContainer
                  group={groups[browseGroupID]}
                  width="100%"
                  gameBroadcast={gameBroadcast}
                  chatBroadcast={chatBroadcast}
                  browseGroupTopN={browseGroupTopN}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></BrowseContainer>
              </div>
              :
              <div className="flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
                <GroupContainer
                  group={groups['gPlayer1Play2']} 
                  width="90%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  browseGroupID={browseGroupID}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
                <GroupContainer
                  group={groups['gPlayer1Event']} 
                  width="10%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
                  browseGroupID={browseGroupID}
                  setBrowseGroupID={setBrowseGroupID}
                  setBrowseGroupTopN={setBrowseGroupTopN}
                ></GroupContainer>
              </div>
            }
            <div className=" flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%", background: "rgba(0, 0, 0, 0.5)"}}>
              <GroupContainer
                group={groups['gPlayer1Hand']} 
                width="80%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gPlayer1Deck']} 
                width="10%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
              <GroupContainer
                group={groups['gPlayer1Discard']} 
                width="10%"
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                browseGroupID={browseGroupID}
                setBrowseGroupID={setBrowseGroupID}
                setBrowseGroupTopN={setBrowseGroupTopN}
              ></GroupContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel */}
      <div className="flex w-1/5" >
        <div className="flex flex-col w-full h-full">
          {/* Hovercard */}
          <div style={{height: "45%"}}>
            <GiantCard></GiantCard>
          </div>
          {/* Chat */}
          <div 
            className="overflow-hidden" 
            style={{height: showScratch ? "12%" : "57%", opacity: 0.7}}
          >
            {gameUI != null && (
              <Chat roomName={gameUI.game_name} chatBroadcast={chatBroadcast} messages={messages} setTyping={setTyping}/>
            )}
          </div>
          {/* Extra */}
          <div style={{height: "40%", display: showScratch ? "block" : "none"}}>        
            <div style={{height: "33.3%"}}>
              <GroupContainer
                  group={groups['gSharedExtra1']} 
                  width="100%"
                  gameBroadcast={gameBroadcast} 
                  chatBroadcast={chatBroadcast}
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
      </div>
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
        <GroupView group={groups['gSharedExtra1']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} showTitle="false"></GroupView>
      </div>
    </Draggable> */}



    </DragDropContext>

  );
}

export default Table;







