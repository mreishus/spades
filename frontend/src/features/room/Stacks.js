import React from "react";
import styled from "@emotion/styled";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Stack } from "./Stack";
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
  overflow-x: ${props => (props.groupType=="deck" || props.groupType=="discard") ? "none" : "auto"};
  overflow-y: ${props => (props.groupType=="deck" || props.groupType=="discard") ? "hidden" : "none"};
  max-height: 87%;
`;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  display: ${props => (props.groupType=="deck" || props.groupType=="discard") ? "" : "flex"};
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

const StacksList = (
  isDraggingOver,
  isDraggingFrom,
  gameBroadcast,
  chatBroadcast,
  playerN,
  groupType,
  stackIds,
  selectedStackIndices,
) => {
  const pile = (groupType=="deck" || groupType=="discard")

  // Truncate stacked piles
  var stackIdsToShow;
  if (pile && isDraggingOver && !isDraggingFrom) stackIdsToShow = [];
  else if (pile && stackIds.length>1) stackIdsToShow = [stackIds[0]]
  else stackIdsToShow = stackIds;
  if (!stackIdsToShow) return null;
  console.log('rendering stacks');
  console.log(selectedStackIndices);
  return (
    stackIdsToShow?.map((stackId, stackIndex) => (
      (selectedStackIndices.includes(stackIndex)) ? (
        <Stack
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
          playerN={playerN}
          groupType={groupType}
          stackIndex={stackIndex}
          stackId={stackId}
          numStacks={selectedStackIndices.length}
        /> 
      ) : null 
    ))
  ) 
};

// function DropZoneContainer(props) {
//   const { 
//     isDraggingOver, 
//     isDraggingFrom, 
//     gameBroadcast, 
//     chatBroadcast, 
//     playerN,
//     group, 
//     stacks, 
//     dropProvided, 
//     selectedStackIndices } = props;

//   return (
//     <Container>
//       <CardBack group={group} isDraggingOver={isDraggingOver} isDraggingFrom={isDraggingFrom}></CardBack>
//       <DropZone ref={dropProvided.innerRef} group={group}>
//         <StacksList
//           isDraggingOver={isDraggingOver}
//           isDraggingFrom={isDraggingFrom}
//           gameBroadcast={gameBroadcast} 
//           chatBroadcast={chatBroadcast} 
//           playerN={playerN}
//           group={group} 
//           stacks={stacks}
//           selectedStackIndices={selectedStackIndices}
//         />
//         {dropProvided.placeholder}
//       </DropZone>
//     </Container>
//   );
// }


export const Stacks = ({
  gameBroadcast,
  chatBroadcast,
  playerN,
  groupId,
  stackIds,
  groupType,
  isCombineEnabled,
  selectedStackIndices,
}) => {
  console.log("rendering stacks ",playerN,groupId,groupType,stackIds)
  return(
    <Droppable
      droppableId={groupId}
      key={groupId}
      isDropDisabled={false}
      isCombineEnabled={isCombineEnabled}
      direction={groupType=="deck" || groupType=="discard" ? "vertical" : "horizontal"}
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={false}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
          type={groupType}
        >
          <Container>
            <CardBack 
              groupType={groupType} 
              stackIds={stackIds} 
              isDraggingOver={dropSnapshot.isDraggingOver} 
              isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}>
            </CardBack>
            <DropZone ref={dropProvided.innerRef} groupType={groupType}>
              <StacksList
                isDraggingOver={dropSnapshot.isDraggingOver}
                isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast} 
                playerN={playerN}
                groupType={groupType} 
                stacksIds={stackIds}
                selectedStackIndices={selectedStackIndices}
              />
              {dropProvided.placeholder}
            </DropZone>
          </Container>
        </Wrapper>
      )}
    </Droppable>
  )
} 





// export default function Stacks(props) {
//   const {
//     gameBroadcast,
//     chatBroadcast,
//     playerN,
//     group,
//     isDropDisabled,
//     isCombineEnabled,
//     selectedStackIndices,
//   } = props;
//   console.log('rendering stacks for ',groupId);

//   return (
//     <Droppable
//       droppableId={groupId}
//       key={groupId}
//       isDropDisabled={isDropDisabled}
//       isCombineEnabled={isCombineEnabled}
//       direction={group.type=="deck" || group.type=="discard" ? "vertical" : "horizontal"}
//     >
//       {(dropProvided, dropSnapshot) => (
//         <Wrapper
//           isDraggingOver={dropSnapshot.isDraggingOver}
//           isDropDisabled={isDropDisabled}
//           isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
//           {...dropProvided.droppableProps}
//           type={group.type}
//         >
//             <DropZoneContainer
//                 isDraggingOver={dropSnapshot.isDraggingOver}
//                 isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
//                 gameBroadcast={gameBroadcast}
//                 chatBroadcast={chatBroadcast}
//                 playerN={playerN}
//                 group={group}
//                 stacks={group.stacks}
//                 dropProvided={dropProvided}
//                 selectedStackIndices={selectedStackIndices}
//             />
//         </Wrapper>
//       )}
//     </Droppable>
//   );
// }
