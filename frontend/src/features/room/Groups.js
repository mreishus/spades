import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chat from "../chat/Chat";
import GroupView from "./GroupView";
import { reorderGroups } from "./Reorder";
import { ActiveCard } from "./ActiveCard";
import styled from "@emotion/styled";
import GameUIContext from "../../contexts/GameUIContext";
import { GROUPSINFO } from "./Constants"
import Button from "../../components/basic/Button";
import axios from 'axios'; 
const cardDB = require('../../../../cardDB/playringsCardDB.json');

//const Tabletop = require('tabletop');



var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/11fW57D2_3gwOFWomWoEEozKOwKsGpYokwmIF_LIy_tY/edit?usp=sharing'

const WidthContainer = styled.div`
  padding: 2px 2px 2px 0.5vw;
  float: left;
  height: 100%;
`;

export const Groups = ({
  gameBroadcast,
  chatBroadcast,
  messages,
  setTyping
}) => {
  const { gameUI, setGameUI } = useContext(GameUIContext);
  const [groups, setGroups] = useState(gameUI.game.groups);
  const [showScratch, setShowScratch] = useState(false);
  const [cardDB, setCardDB] = useState(null);
  const [phase, setPhase] = useState(1);
  //const [selectedFile, setSelectedFile] = useState(null);
  //const activeCard = useActiveCard();
  const inputFile = useRef(null) 

  console.log('Rendering groups');
  
  const toggleScratch = () => {
    if (showScratch) setShowScratch(false);
    else setShowScratch(true);
  }

  const changePhase = (num) => {
    if (num!==phase) setPhase(num);
  }

  useEffect(() => {    
     setGroups(gameUI.game.groups);
  }, [gameUI.game.groups]);

  function loadDeckFile() {
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
        sections.forEach(section => {
          const sectionName = section['$'].name;
          console.log(sectionName);
          const cards = section.card;
          if (!cards) return;
          cards.forEach(card => {
            console.log(card['$'].id);
            console.log(card['$'].qty);
            console.log(card._);
            const id = card._;
            const cardRow = cardDB[id];
            console.log(cardRow);
          })
        })
      })
    }
    reader.readAsText(event.target.files[0])
  }
  
  // const getRowFromCardDB = (id) => {
  //   for (var i = 0; i<cardDB.length; i++) {
  //     if (cardDB[i].ID === id) return cardDB[i];
  //   }
  //   return null;
  // }

  // useEffect(() => {
  //   Tabletop.init( { key: publicSpreadsheetUrl, callback: showInfo, simpleSheet: false } )
  // }, []);
 
  // const showInfo = (data, tabletop) => {
  //   setCardDB(data);
  //   console.log(data);
  // }

  const onDragEnd = (result) => {
    const source = result.source;
    const sourceStacks = groups[source.droppableId].stacks;
    const sourceStack = sourceStacks[source.index];    
    const topOfSourceStack = sourceStack.cards[0];
    const topCardNameSource = topOfSourceStack["sides"][topOfSourceStack["currentSide"]].name;

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
      const topCardNameDest = topOfDestStack["sides"][topOfDestStack["currentSide"]].name;
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
      chatBroadcast("game_update",{message: "attached "+topCardNameSource+" from "+GROUPSINFO[source.droppableId].name+" to "+topCardNameDest+" in "+GROUPSINFO[destination.droppableId].name+"."})
 

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
      dest_stack_index: destination.index
    });
    const sourceGroupTitle = GROUPSINFO[source.droppableId].name;
    const destGroupTitle = GROUPSINFO[destination.droppableId].name;
    if (sourceGroupTitle != destGroupTitle) chatBroadcast("game_update",{message: "moved "+topCardNameSource+" from "+sourceGroupTitle+" to "+destGroupTitle+"."})
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
    // gameBroadcast("update_groups",{groups: data.groups});
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
              <WidthContainer style={{width: "75%"}}>                
                <GroupView group={groups['gSharedStaging']} key={'gSharedStaging'} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <GroupView group={groups['gSharedActive']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
              <WidthContainer style={{width: "15%"}}>
                <GroupView group={groups['gSharedMainQuest']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
              
            </div> 
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <WidthContainer style={{width: "100%"}}>
                <GroupView group={groups['gPlayer1Engaged']} key={'gPlayer1Engaged'} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
            </div>
              
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <WidthContainer style={{width: "100%"}}>
                <GroupView group={groups['gPlayer1Play1']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
            </div>
            <div className="flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <WidthContainer style={{width: "90%"}}>
                <GroupView group={groups['gPlayer1Play2']} showTitle="false" gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <GroupView group={groups['gPlayer1Event']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
            </div>
            <div className=" flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%", background: "rgba(0, 0, 0, 0.5)"}}>
              <WidthContainer style={{width: "80%"}}>
                <GroupView group={groups['gPlayer1Hand']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <GroupView group={groups['gPlayer1Deck']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <GroupView group={groups['gPlayer1Discard']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></GroupView>
              </WidthContainer>
            </div>
          </div>
          <div className="bg-gray-300" style={{height: "3%"}}>
            Social links
            <Button isPrimary onClick={loadDeckFile}>
              Load Deck
            </Button>
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
            <ActiveCard></ActiveCard>
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
          <div
            style={{
              height: "40%", 
              display: showScratch ? "block" : "none"
            }}
          >        
            <div style={{height: "33.3%"}}>
              <GroupView group={groups['gSharedExtra1']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} showTitle="false"></GroupView>
            </div>
            <div style={{height: "33.3%"}}>
              <GroupView group={groups['gSharedExtra2']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} showTitle="false"></GroupView></div>
            <div style={{height: "33.4%"}}>
              <GroupView group={groups['gSharedExtra3']} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} showTitle="false"></GroupView></div>
          </div>
          <div className="text-center" onClick={() => toggleScratch()} style={{height: "3%"}}>
            <FontAwesomeIcon className="text-white" icon={showScratch ? faChevronDown : faChevronUp}/>
          </div>
        </div>
      </div>
    </div>
    </DragDropContext>

  );
}

export default Groups;












// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import { generateQuoteMap } from "./data";
// import styled from "@emotion/styled";
// import GroupView from "./Group";
// import Reorder, { reorderGroups } from "./Reorder";
// import { DragDropContext } from "react-beautiful-dnd";

// const data = {
//   small: generateQuoteMap(10),
//   medium: generateQuoteMap(100),
//   large: generateQuoteMap(250)
// };

// const WidthContainer = styled.div`
//   min-height: 100vh;
//   /* like display:flex but will allow bleeding over the window width */
//   min-width: 100vw;
//   /* display: inline-flex; */
// `;

// export const Groups = ({
//   gameUIView,
//   gameBroadcast,
// }) => {

//   const [groups, setGroups] = useState(gameUIView.game_ui.game.groups);
//   const [showScratch, setShowScratch] = useState(false);
//   const [phase, setPhase] = useState(1);
//   const [activeCard, setActiveCard] = useState(null);

//   function toggleScratch() {
//     if (showScratch) setShowScratch(false);
//     else setShowScratch(true);
//   }

//   function changePhase(num) {
//     if (num!=phase) setPhase(num);
//   }

//   useEffect(() => {    
//     setGroups(gameUIView.game_ui.game.groups);
//   }, [gameUIView.game_ui.game.groups]);

//   const [state,setState] = useState({
//     columns: data.large,
//     ordered: Object.keys(data.medium)
//   });

//   // const onDragEnd = (result) => {
//   //   console.log(result);
//   //   if (!result.destination) return;
//   //   const { source, destination } = result;
//   //   var newGroups = {};
//   //   if (source.droppableId !== destination.droppableId) {
//   //     const sourceGroupView = groups[source.droppableId];
//   //     const destGroupView = groups[destination.droppableId];
//   //     const sourceStacks = [...sourceGroup.stacks];
//   //     const destStacks = [...destGroup.stacks];
//   //     const [removed] = sourceStacks.splice(source.index, 1);
//   //     destStacks.splice(destination.index, 0, removed);
//   //     newGroups = {
//   //       ...groups,
//   //       [source.droppableId]: {
//   //         ...sourceGroup,
//   //         stacks: sourceStacks
//   //       },
//   //       [destination.droppableId]: {
//   //         ...destGroup,
//   //         stacks: destStacks
//   //       }
//   //     }
//   //   } else {
//   //     const group = groups[source.droppableId];
//   //     const copiedStacks = [...group.stacks];
//   //     const [removed] = copiedStacks.splice(source.index, 1);
//   //     copiedStacks.splice(destination.index, 0, removed);
//   //     newGroups = {
//   //       ...groups,
//   //       [source.droppableId]: {
//   //         ...group,
//   //         stacks: copiedStacks
//   //       }
//   //     }
//   //   }
//   //   setGroups(newGroups);
//   //   gameBroadcast("update_groups",{groups: newGroups});
//   // };

//   const onDragEnd = (result) => {
//     if (result.combine) {
//       return;
//       const column = state.columns[result.source.droppableId];
//       const withQuoteRemoved = [...column];
//       withQuoteRemoved.splice(result.source.index, 1);
//       const columns = {
//         ...state.columns,
//         [result.source.droppableId]: withQuoteRemoved
//       };
//       setState({ columns, ordered: state.ordered });
//       return;
//     }

//     // dropped nowhere
//     if (!result.destination) {
//       return;
//     }
//     console.log(result);
//     const source = result.source;
//     const destination = result.destination;

//     // did not move anywhere - can bail early
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     console.log('here');
//     const data = reorderGroups({
//       groups: groups,
//       source,
//       destination
//     });

//     setGroups(data.groups);
//     // setState({
//     //   columns: data.quoteMap,
//     //   ordered: state.ordered
//     // });
//   };

//   const columns = state.columns;
//   const ordered = state.ordered;
//   console.log('ordered');
//   console.log(ordered);
//   // const {
//   //   containerHeight,
//   //   useClone,
//   //   isCombineEnabled,
//   //   withScrollableColumns
//   // } = props;

//   const board = (

//     <WidthContainer>
//       <Group
//         gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}
//         group={groups['gSharedQuestDeck']}
//         key={'gSharedQuestDeck'}
//         title={groups['gSharedQuestDeck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />
//       <Group
//         gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}
//         group={groups['gSharedEncounterDeck']}
//         key={'gSharedEncounterDeck'}
//         title={groups['gSharedEncounterDeck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />      
//       <Group
//         gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}
//         group={groups['gPlayer1Deck']}
//         key={'gPlayer1Deck'}
//         title={groups['gPlayer1Deck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />  
//       <Group
//         gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}
//         group={groups['gPlayer2Deck']}
//         key={'gPlayer2Deck'}
//         title={groups['gPlayer2Deck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />  
//       <Group
//         gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}
//         group={groups['gPlayer3Deck']}
//         key={'gPlayer3Deck'}
//         title={groups['gPlayer3Deck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />
      
//     </WidthContainer>
//   );

//   return (
//     <React.Fragment>
//       <DragDropContext onDragEnd={onDragEnd}>
//         {board}
//       </DragDropContext>
//     </React.Fragment>
//   );
// }
