import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chat from "../chat/Chat";
import { GroupView, GroupContainer } from "./GroupView";
import BrowseContainer from "./Browse";
import { reorderGroups } from "./Reorder";
import { GiantCard } from "./GiantCard";
import styled from "@emotion/styled";
import GameUIContext from "../../contexts/GameUIContext";
import { GROUPSINFO } from "./Constants"
import Button from "../../components/basic/Button";
import { getDisplayName } from "./CardView"
import ReactModal from "react-modal";
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

export const Table = ({
  gameBroadcast,
  chatBroadcast,
  messages,
  setTyping
}) => {
  const { gameUI, setGameUI } = useContext(GameUIContext);
  const [groups, setGroups] = useState(gameUI.game.groups);
  const [showScratch, setShowScratch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Show/hide group that allows you to browse certain cards in a group
  const [browseGroupID, setBrowseGroupID] = useState("");
  // Indices of stacks in group being browsed
  const [browseGroupTopN, setBrowseGroupTopN] = useState(0);
  //const [cardDB, setCardDB] = useState(null);
  const [phase, setPhase] = useState(1);
  //const [selectedFile, setSelectedFile] = useState(null);
  //const activeCard = useActiveCard();
  const inputFile = useRef(null) 
  console.log('Rendering groups');
  
  const toggleScratch = () => {
    if (showScratch) setShowScratch(false);
    else setShowScratch(true);
  }

  const handleBrowseSelect = (event) => {
    const groupID = event.target.value;
    setBrowseGroupID(groupID);
    setBrowseGroupTopN(0);
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
    console.log(cardDB);
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
              
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%", display: (browseGroupID)? "none": "block"}}>
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
            
            <div className="flex flex-1 bg-gray-700 border rounded-lg outline-none ml-3 mr-3" style={{minHeight: "20%", height: "20%", maxHeight: "20%", display: (browseGroupID)? "block": "none"}}>
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
          <div className="bg-gray-300" style={{height: "3%"}}>
            <Button isPrimary onClick={loadDeckFile}>
              Load Deck
            </Button>
            <Button isPrimary onClick={resetGame}>
              Reset Game
            </Button>
            <Button isPrimary onClick={() => {browseGroupID? setBrowseGroupID("") : setBrowseGroupID("gSharedEncounterDeck")}}>
              Browse Group
            </Button>
            <select name="numFaceup" id="numFaceup" onChange={handleBrowseSelect}>
              <option value="" disabled selected>Look at...</option>
              {Object.keys(GROUPSINFO).map((groupID, index) => {
                return(<option value={groupID}>{GROUPSINFO[groupID].name}</option>)
              })}
            </select>
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={loadDeck}/>
          </div>
          <div className="bg-gray-200" style={{height: "3%"}}>
            <select name="num_players" id="num_players">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            player(s)
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
    {/* <Draggable>
    <ReactModal
      closeTimeoutMS={200}
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      contentLabel="Create New Game"
      overlayClassName="fixed inset-0 bg-black-0 z-50"
      className="insert-auto overflow-auto p-5 bg-gray-700 border rounded-lg outline-none"
      style={{  content : {
        height: "20%",
        width: "60%",
        marginTop:"20%",
        zindex:1e9,
      }}}
    >
      <div style={{height: "25vh",zIndex:1e7}}>
      <GroupView group={groups['gSharedExtra1']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} showTitle="false"></GroupView>
      </div>
    </ReactModal>
    </Draggable> */}

    {/* <Draggable>
      <div style={{height:"200px",width:"800px",top:"0px",left:"0px",position:"relative",backgroundColor:"red",zIndex:1e7}}>
        <GroupView group={groups['gSharedExtra1']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} showTitle="false"></GroupView>
      </div>
    </Draggable> */}



    </DragDropContext>

  );
}

export default Table;







