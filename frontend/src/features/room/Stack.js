import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import styled from "@emotion/styled";
import { Card } from "./Card";
import { CARDSCALE } from "./Constants";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";


const Container = styled.div`
  position: relative;
  userSelect: none;
  padding: 0;
  cursor: default;
  min-width: ${props => props.stackWidth}vw;
  width: ${props => props.stackWidth}vw;
  min-height: 100%;
  height: 100%;
  min-height: ${CARDSCALE/0.75}vw;
`;

function getStyle(provided, style) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style
  };
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over can give considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent

export const Stack = ({
  gameBroadcast,
  chatBroadcast,
  playerN,
  groupType,
  stackIndex,
  stackId,
  numStacks,
}) => {
  const stackStore = state => state?.gameUi?.game?.stackById[stackId];
  const stack = useSelector(stackStore);
  if (!stack) return null;
  const cardIds = stack.cardIds;
  console.log('rendering stack ',stackIndex);
  // Calculate size of stack for proper spacing. Changes base on group type and number of stack in group.
  const numStacksNonZero = numStacks > 0 ? numStacks : 1;
  var handSpacing = 100*0.8*0.8*0.8/(numStacksNonZero);
  if (handSpacing > CARDSCALE) handSpacing = CARDSCALE;
  const stackWidth = groupType == "hand" ? handSpacing : CARDSCALE/0.72 + CARDSCALE/3*(cardIds.length-1);
  //const stackWidth = CARDSCALE/0.72 + CARDSCALE/3*(stack.cards.length-1);
  return (
    <Draggable 
      key={stackId} 
      draggableId={stackId} 
      index={stackIndex}
    >
      {(dragProvided, dragSnapshot) => (
        <Container
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          stackWidth={stackWidth}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          {cardIds.map((cardId, cardIndex) => {
            return(
              <Card
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast} 
                playerN={playerN}
                cardId={cardId} 
                cardIndex={cardIndex}
              />
            )
        })}
        </Container>
      )}
    </Draggable>
  );
}
