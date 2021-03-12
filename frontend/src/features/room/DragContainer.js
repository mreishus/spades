
import React, { useState, useEffect, useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from 'react-redux';
import { setStackIds, setCardIds, setGroupById } from "./gameUiSlice";
import { reorderGroupStackIds } from "./Reorder";
import { Table } from "./Table";
import { GROUPSINFO } from "./Constants"
import { getDisplayName, getCurrentFace } from "./Helpers"

export const DragContainer = ({
  playerN,
  gameBroadcast,
  chatBroadcast,
  messages,
  setTyping
}) => {
  const gameStore = state => state?.gameUi?.game;
  const dispatch = useDispatch();
  const game = useSelector(gameStore);

  const onDragEnd = (result) => {
    console.log("drag end ",result);
    const groupById = game.groupById;
    const orig = result.source;
    const origGroupId = orig.droppableId;
    const origGroup = groupById[origGroupId];
    const origGroupStackIds = origGroup.stackIds;
    const origStackId = origGroupStackIds[orig.index];    
    const origStack = game.stackById[origStackId];
    const origStackCardIds = origStack.cardIds;
    const topOfOrigStackCardId = origStackCardIds[0];
    const topOfOrigStackCard = game.cardById[topOfOrigStackCardId];

    // Combine
    if (result.combine) {
      console.log("combine");
      const dest = result.combine;
      const destGroupId = dest.droppableId;
      const destGroupStackIds = groupById[destGroupId].stackIds;
      console.log(destGroupStackIds)

      dest.index = -1;
      for(var i=0; i<=destGroupStackIds.length; i++) {
        if(destGroupStackIds[i] == dest.draggableId){
          dest.index = i;
        }
      }
      if (!dest.index < 0) return;
      const destStackId = destGroupStackIds[dest.index];
      console.log(destStackId)
      const destStack = game.stackById[destStackId];
      console.log(destStack)
      const destStackCardIds = destStack.cardIds;
      console.log(destStackCardIds)
      const topOfDestStackCardId = destStackCardIds[0];
      console.log(topOfDestStackCardId)
      const topOfDestStackCard = game.cardById[topOfDestStackCardId];
      console.log(topOfDestStackCard)
      const newDestStackCardIds = destStackCardIds.concat(origStackCardIds);
      console.log(newDestStackCardIds)

      console.log(origGroupId, orig.index, destGroupId, dest.index);

      const newDestStack = {
        ...destStack,
        cardIds: newDestStackCardIds,
      }

      const newOrigGroupStackIds = Array.from(origGroupStackIds);
      newOrigGroupStackIds.splice(orig.index, 1);

      const newOrigGroup = {
        ...origGroup,
        stackIds: newOrigGroupStackIds
      }   
      dispatch(setStackIds(newOrigGroup))
      dispatch(setCardIds(newDestStack))
      gameBroadcast("update_values", {
        paths: [
          ["game", "groupById", origGroupId, "stackIds"],
          ["game", "stackById", destStackId, "cardIds"]
        ],
        values: [
          newOrigGroupStackIds,
          newDestStackCardIds
        ]
      })
      //gameBroadcast("update_value", {path: ["game", "groupById", origGroupId, "stackIds"], value: newOrigGroupStackIds})
      //gameBroadcast("update_value", {path: ["game", "stackById", destStackId, "cardIds"], value: newDestStackCardIds})
      chatBroadcast("game_update",{message: "attached "+getDisplayName(topOfOrigStackCard)+" from "+GROUPSINFO[origGroupId].name+" to "+getDisplayName(topOfDestStackCard)+" in "+GROUPSINFO[destGroupId].name+"."})
      //gameBroadcast("update_gameui",{gameui: newGameUi});    
      
    }

    // Dropped nowhere
    if (!result.destination) {
      return;
    }
    const dest = result.destination;
    const destGroupId = dest.droppableId;

    // Did not move anywhere - can bail early
    if (
      orig.droppableId === dest.droppableId &&
      orig.index === dest.index
    ) {
      return;
    }

    // Moved to a different spot
    const newGroupById = reorderGroupStackIds(groupById, orig, dest);

    dispatch(setGroupById(newGroupById));
    //dispatch(setStackIds(newGroupById[origGroupId]))
    //dispatch(setStackIds(newGroupById[destGroupId]))
    //gameBroadcast("update_value", {path: ["game", "groupById"], value: newGroupById})
    gameBroadcast("update_values", {
      paths: [
        ["game", "groupById", origGroupId, "stackIds"],
        ["game", "groupById", destGroupId, "stackIds"]
      ],
      values: [
        newGroupById[origGroupId].stackIds,
        newGroupById[destGroupId].stackIds
      ]
    })
//    gameBroadcast("update_value", {path: ["game", "groupById", origGroupId, "stackIds"], value: newGroupById[origGroupId].stackIds})
    if (origGroupId != destGroupId) {
      //gameBroadcast("update_value", {path: ["game", "groupById", destGroupId, "stackIds"], value: newGroupById[destGroupId].stackIds})
      const origGroupTitle = GROUPSINFO[origGroupId].name;
      const destGroupTitle = GROUPSINFO[destGroupId].name;
      chatBroadcast("game_update",{message: "moved "+getDisplayName(topOfOrigStackCard)+" from "+origGroupTitle+" to "+destGroupTitle+"."})
    }

/*     gameBroadcast("move_stack",{
      orig_group_id: orig.droppableId, 
      orig_stack_index: orig.index, 
      dest_group_id: destination.droppableId, 
      dest_stack_index: destination.index,
      preserve_state: false,
    }); */
    // const sourceGroupTitle = GROUPSINFO[orig.droppableId].name;
    // const destGroupTitle = GROUPSINFO[destination.droppableId].name;
    // if (sourceGroupTitle != destGroupTitle) 
    // //gameBroadcast("update_gameui",{gameui: newGameUi});


  }

  return(
    <DragDropContext onDragEnd={onDragEnd}>
      <Table
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        messages={messages}
        setTyping={setTyping}
      />
    </DragDropContext>
  )
};