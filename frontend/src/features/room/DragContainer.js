
import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setStackIds, setCardIds } from "./gameUiSlice";

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

    if (result.combine) {
      console.log("combine");
      const destination = result.combine;
      const destGroupId = destination.droppableId;
      const destGroupStackIds = groupById[destGroupId].stackIds;
      console.log(destGroupStackIds)

      destination.index = -1;
      for(var i=0; i<=destGroupStackIds.length; i++) {
        if(destGroupStackIds[i] == destination.draggableId){
          destination.index = i;
        }
      }
      if (!destination.index < 0) return;
      const destStackId = destGroupStackIds[destination.index];
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

      console.log(origGroupId, orig.index, destGroupId, destination.index);
      //dispatch()

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

      //dispatch(setGroups(newGroups));
      //gameBroadcast("update_gameui",{gameui: newGameUi});    
      //chatBroadcast("game_update",{message: "attached "+getDisplayName(topOfOrigStackCard)+" from "+GROUPSINFO[orig.droppableId].name+" to "+getDisplayName(topOfDestStackCard)+" in "+GROUPSINFO[destination.droppableId].name+"."})


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
      orig.droppableId === destination.droppableId &&
      orig.index === destination.index
    ) {
      return;
    }

    // const data = reorderGroups({
    //   groups: groupById,
    //   source: orig,
    //   destination
    // });

    // const newGameUi = {
    //   ...gameUi,
    //   "game": {
    //     ...game,
    //     "groupById": data["groupById"]
    //   }
    // }   
    //dispatch(setGroups(data["groupById"]))
    //setGroups(newGroups);
    // gameBroadcast("move_stack",{
    //   orig_group_id: orig.droppableId, 
    //   orig_stack_index: orig.index, 
    //   dest_group_id: destination.droppableId, 
    //   dest_stack_index: destination.index,
    //   preserve_state: false,
    // });
    // const sourceGroupTitle = GROUPSINFO[orig.droppableId].name;
    // const destGroupTitle = GROUPSINFO[destination.droppableId].name;
    // if (sourceGroupTitle != destGroupTitle) chatBroadcast("game_update",{message: "moved "+getDisplayName(topOfOrigStackCardId)+" from "+sourceGroupTitle+" to "+destGroupTitle+"."})
    // //gameBroadcast("update_gameui",{gameui: newGameUi});


    // setGroups(data["groupById"]);
    // // gameBroadcast(
    // //   "update_2_groups",
    // //   {
    // //     groupId1: source.droppableId,
    // //     groupIndex1: data["groupById"][source.droppableId],
    // //     groupId2: destination.droppableId,
    // //     groupIndex2: data["groupById"][destination.droppableId],
    // // })
    // setState({
    //   columns: data.quoteMap,
    //   ordered: state.ordered
    // });
  }

};