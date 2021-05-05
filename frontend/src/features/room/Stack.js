import React from "react";
import { useSelector } from 'react-redux';
import styled from "@emotion/styled";
import { Card } from "./Card";
import { Draggable } from "react-beautiful-dnd";


const Container = styled.div`
  position: relative;
  userSelect: none;
  padding: 0;
  min-width: ${props => props.stackWidth}vw;
  width: ${props => props.stackWidth}vw;
  min-height: 100%;
  height: 100%;
  min-height: ${props => props.cardSize/0.75}vw;
  display: flex;
`;

export const Stack = React.memo(({
  gameBroadcast,
  chatBroadcast,
  playerN,
  groupId,
  groupType,
  stackIndex,
  cardSize,
  stackId,
  numStacks,
  registerDivToArrowsContext
}) => {
  const stackStore = state => state?.gameUi?.game?.stackById[stackId];
  const stack = useSelector(stackStore);
  if (!stack) return null;
  const cardIds = stack.cardIds;
  console.log('Rendering Stack ',stackIndex);
  // Calculate size of stack for proper spacing. Changes base on group type and number of stack in group.
  const numStacksNonZero = numStacks > 0 ? numStacks : 1;
  var handSpacing = 45/(numStacksNonZero);
  if (handSpacing > cardSize) handSpacing = cardSize;
  const stackWidth = groupType === "hand" ? handSpacing : cardSize/0.72 + cardSize/3*(cardIds.length-1);
  //const stackWidth = cardSize/0.72 + cardSize/3*(stack.cards.length-1);
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
          cardSize={cardSize}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          {cardIds.map((cardId, cardIndex) => {
            return(
              <Card
                key={cardId}
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast} 
                playerN={playerN}
                groupId={groupId}
                cardId={cardId} 
                cardIndex={cardIndex}
                cardSize={cardSize}
                registerDivToArrowsContext={registerDivToArrowsContext}
              />
            )
        })}
        </Container>
      )}
    </Draggable>
  );
})
