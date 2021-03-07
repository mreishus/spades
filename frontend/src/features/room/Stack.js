import React, { Component } from "react";
import styled from "@emotion/styled";
import CardView from "./Card";
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

export default class StackView extends Component {
  
  // This optimization doesn't work because when you hover over a card somewhere earlier in the group, this card also needs to update
  // shouldComponentUpdate = (nextProps, nextState) => {
  //     if (dragSnapshot.isDragging || this.props.isGroupedOver) return true;
  //     if (JSON.stringify(nextProps.stack)===JSON.stringify(stack)) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  // };
  render() {
    console.log('Stackview',this.props.playerN);
    const stack = JSON.parse(this.props.stack);
    const numStacks = this.props.numStacks > 0 ? this.props.numStacks : 1;
    var handSpacing = 100*0.8*0.8*0.8/(this.props.numStacks);
    if (handSpacing > CARDSCALE) handSpacing = CARDSCALE;
    const stackWidth = this.props.groupType == "hand" ? handSpacing : CARDSCALE/0.72 + CARDSCALE/3*(stack.cards.length-1);
    //const stackWidth = CARDSCALE/0.72 + CARDSCALE/3*(stack.cards.length-1);
    return (
      <Draggable 
      key={stack.id} 
      draggableId={stack.id} 
      index={this.props.stackIndex}
    >
      {(dragProvided, dragSnapshot) => (
      <Container
        isDragging={dragSnapshot.isDragging}
        isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
        isClone={this.props.isClone}
        stackWidth={stackWidth}
        ref={dragProvided.innerRef}
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
        style={getStyle(dragProvided, this.props.style)}
        data-is-dragging={dragSnapshot.isDragging}
        data-testid={stack.id}
        data-index={this.props.index}
      >
      {stack.cards.map((card, cardIndex) => {
          return(

            <CardView
              gameBroadcast={this.props.gameBroadcast} 
              chatBroadcast={this.props.chatBroadcast} 
              playerN={this.props.playerN}
              groupId={this.props.groupId} 
              stackIndex={this.props.stackIndex}
              cardIndex={cardIndex}
              inputCard={JSON.stringify(card)} 
              key={card.id} 
            >
            </CardView>
          )
      })}
      </Container>
      )}
      </Draggable>
    );
  }
}



/* 

function StackView(props) {
  const {
    gameBroadcast,
    group,
    stackIndex,
    stack,
    isDragging,
    isGroupedOver,
    provided,
    style,
    isClone,
    index,
  } = props;

  console.log(group.id,group.stacks.length);
  var handSpacing = 100*0.8*0.8*0.8/(group.stacks.length);
  if (handSpacing > CARDSCALE) handSpacing = CARDSCALE;
  const stackWidth = group.type == "hand" ? handSpacing : CARDSCALE/0.75 + CARDSCALE/3*(stack.cards.length-1);

  console.log('rendering',group.id,stackIndex);
  //console.log(stackIndex);
  //console.log(stack.cards);

  return (

    <Container
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      isClone={isClone}
      stackWidth={stackWidth}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={stack.id}
      data-index={index}
    >
      {stack.cards.map((card, cardIndex) => {
          return(
    
            <CardView
              gameBroadcast={gameBroadcast} 
              groupId={group.id} 
              group={group}
              stackIndex={stackIndex}
              cardIndex={cardIndex}
              inputCard={card} 
              key={card.id} 
            >
            </CardView>
          )
      })}
    </Container>


  );
} */

//export default StackView;
