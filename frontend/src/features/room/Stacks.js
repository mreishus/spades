import React from "react";
import styled from "@emotion/styled";
import { Droppable, Draggable } from "react-beautiful-dnd";
import StackView from "./StackView";
import CardBack from "./CardBack"

const Wrapper = styled.div`
  background-color: ${props => props.isDraggingOver ? "rgba(1,1,1,0.5)" : ""};
  moz-box-shadow: ${props => props.isDraggingOver ? "0 0 15px 12px rgba(1,1,1,0.5)" : ""};
  webkit-box-shadow: ${props => props.isDraggingOver ? "0 0 15px 12px rgba(1,1,1,0.5)" : ""};
  box-shadow: ${props => props.isDraggingOver ? "0 0 15px 12px rgba(1,1,1,0.5)" : ""};
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
  padding: 0 0 0 0;
  height: 87%;
  user-select: none;
  overflow-x: ${props => (props.type=="deck" || props.type=="discard") ? "none" : "auto"};
  overflow-y: ${props => (props.type=="deck" || props.type=="discard") ? "hidden" : "none"};
  max-height: 87%;
`;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  display: ${props => (props.group.type=="deck" || props.group.type=="discard") ? "" : "flex"};
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 0 0 0 0;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div`
  height: 100%;
`;
/* stylelint-enable */

const StacksList = React.memo(function StacksList(props) {
  const pile = (props.group.type=="deck" || props.group.type=="discard")

  // Truncate stacked piles
  var stacks;
  if (pile && props.isDraggingOver && !props.isDraggingFrom) stacks = [];
  else if (pile && props.stacks.length>1) stacks = [props.stacks[0]]
  else stacks = props.stacks;
  console.log('rendering stacks for ',props.group.id);
  console.log(props.selectedStackIndices);
  return stacks?.map((stack, stackIndex) => (
      (props.selectedStackIndices.includes(stackIndex)) ? (
        <Draggable 
          key={stack.id} 
          draggableId={stack.id} 
          index={stackIndex}
        >
          {(dragProvided, dragSnapshot) => (
            <StackView
              gameBroadcast={props.gameBroadcast}
              chatBroadcast={props.chatBroadcast}
              PlayerN={props.PlayerN}
              group={props.group}
              stackIndex={stackIndex}
              stack={stack}
              key={stack.id}
              isDragging={dragSnapshot.isDragging}
              isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
              provided={dragProvided}
              numStacks={props.selectedStackIndices.length}
            />
          )}
        </Draggable>
      ) : null 

  ));
});

function DropZoneContainer(props) {
  const { 
    isDraggingOver, 
    isDraggingFrom, 
    gameBroadcast, 
    chatBroadcast, 
    PlayerN,
    group, 
    stacks, 
    dropProvided, 
    selectedStackIndices } = props;

  return (
    <Container>
      <CardBack group={group} isDraggingOver={isDraggingOver} isDraggingFrom={isDraggingFrom}></CardBack>
      <DropZone ref={dropProvided.innerRef} group={group}>
        <StacksList
          isDraggingOver={isDraggingOver}
          isDraggingFrom={isDraggingFrom}
          gameBroadcast={gameBroadcast} 
          chatBroadcast={chatBroadcast} 
          PlayerN={PlayerN}
          group={group} 
          stacks={stacks}
          selectedStackIndices={selectedStackIndices}
        />
        {dropProvided.placeholder}
      </DropZone>
    </Container>
  );
}

export default function Stacks(props) {
  const {
    gameBroadcast,
    chatBroadcast,
    PlayerN,
    group,
    isDropDisabled,
    isCombineEnabled,
    selectedStackIndices,
  } = props;
  console.log('rendering stacks for ',group.id);
  console.log(props.selectedStackIndices);

  return (
    <Droppable
      droppableId={group.id}
      key={group.id}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      direction={group.type=="deck" || group.type=="discard" ? "vertical" : "horizontal"}
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
          type={group.type}
        >
            <DropZoneContainer
                isDraggingOver={dropSnapshot.isDraggingOver}
                isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
                gameBroadcast={gameBroadcast}
                chatBroadcast={chatBroadcast}
                PlayerN={PlayerN}
                group={group}
                stacks={group.stacks}
                dropProvided={dropProvided}
                selectedStackIndices={selectedStackIndices}
            />
        </Wrapper>
      )}
    </Droppable>
  );
}
