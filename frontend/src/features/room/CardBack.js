/* The image shown below the deck of cards*/

import React from "react";
import styled from "@emotion/styled";
import { CARDSCALE, playerBackSRC, encounterBackSRC} from "./Constants"

export function getCardFace(card) {
    return card["sides"][card["currentSide"]];
}

// const Container = styled.div`
//     height: ${props => (CARDSCALE * props.cardFace.height)}vw,
//     width: ${props => (CARDSCALE * props.cardFace.width)}vw,
//     left: ${props => (0.2 + (1.39-props.cardFace.width)*CARDSCALE/2)}vw,
//     top: ${props => (0.2 + (1.39-props.cardFace.height)*CARDSCALE/2)}vw,
//     border-width: 0px;
//     border-color: black;
//     position: absolute;
//     margin: 0 0 0 0.75vw;
//     background: url(${props => (props.cardFace.src)}) no-repeat; 
//     background-size: contain;
// `;

const Container = styled.div`
    min-height: 40.5vw,
    min-width: 40.5vw,
    height: 40.5vw,
    width: 40.5vw,
    border-width: 2px;
    border-color: red;
    position: absolute;
    margin: 0 0 0 0.75vw;
    background: url(${props => (props.src)}) no-repeat; 
    background-size: contain;
`;


function CardBack(props) {
  const {
    group,
    isDraggingOver,
    isDraggingFrom
  } = props;

  var cardFace;
  if (group.type=="deck" && group.stacks.length>0 && isDraggingOver && !isDraggingFrom) {
      cardFace = getCardFace(group.stacks[0].cards[0])
  } else if (group.type=="deck" && group.stacks.length>1 && isDraggingFrom) {
     cardFace = getCardFace(group.stacks[1].cards[0])
  } else if (group.type=="discard" && group.stacks.length>0 && isDraggingOver && !isDraggingFrom) {
      cardFace = getCardFace(group.stacks[0].cards[0])
  } else if (group.type=="discard" && group.stacks.length>1 && isDraggingFrom) {
     cardFace = getCardFace(group.stacks[1].cards[0])
  }
  if (cardFace) {
    console.log("SHOWING "+cardFace.name);
    return (
        <div 
            style={{
                background:`url(${cardFace.src}) no-repeat scroll 0% 0% / contain`,
                borderWidth: '1px',
                borderRadius: '6px',
                borderColor: 'transparent',
                position:"relative",
                width:`${CARDSCALE*cardFace.width}vw`,
                height:`${CARDSCALE*cardFace.height}vw`,
                left:`${0.2 + (1.39-cardFace.width)*CARDSCALE/2}vw`,
                top:`${0.2 + (1.39-cardFace.height)*CARDSCALE/2}vw`,
            }}
        >
        </div>)
    //return (<Container className='text-white' src={cardFace.src}>test</Container>);
  } else {
    return (<div></div>);
  }
}

//left: `${0.2 + (1.39-currentFace.width)*CARDSCALE/2 + CARDSCALE/3*cardIndex}vw`,
//top: `${0.2 + (1.39-currentFace.height)*CARDSCALE/2}vw`,

export default CardBack;
