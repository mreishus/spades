/* The image shown below the deck of cards*/

import React from "react";
import styled from "@emotion/styled";
import { CARDSCALE, playerBackSRC, encounterBackSRC} from "./Constants"
import { getCurrentFace, getVisibleFaceSRC } from "./Helpers";



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
    isDraggingFrom,
    playerN,
  } = props;

  var currentSideSRC;
  var currentFace;
  if (group.type=="deck" && group.stacks.length>0 && isDraggingOver && !isDraggingFrom) {
    currentSideSRC = getVisibleFaceSRC(group.stacks[0].cards[0],playerN)
    currentFace = getCurrentFace(group.stacks[0].cards[0])
  } else if (group.type=="deck" && group.stacks.length>1 && isDraggingFrom) {
    currentSideSRC = getVisibleFaceSRC(group.stacks[1].cards[0],playerN)
    currentFace = getCurrentFace(group.stacks[0].cards[0])
  } else if (group.type=="discard" && group.stacks.length>0 && isDraggingOver && !isDraggingFrom) {
    currentSideSRC = getVisibleFaceSRC(group.stacks[0].cards[0],playerN)
    currentFace = getCurrentFace(group.stacks[0].cards[0])
  } else if (group.type=="discard" && group.stacks.length>1 && isDraggingFrom) {
    currentSideSRC = getVisibleFaceSRC(group.stacks[1].cards[0],playerN)
    currentFace = getCurrentFace(group.stacks[0].cards[0])
  }
  if (currentFace) {
    return (
        <div 
            style={{
                background:`url(${currentSideSRC}) no-repeat scroll 0% 0% / contain`,
                borderWidth: '1px',
                borderRadius: '6px',
                borderColor: 'transparent',
                position:"relative",
                width:`${CARDSCALE*currentFace.width}vw`,
                height:`${CARDSCALE*currentFace.height}vw`,
                left:`${0.2 + (1.39-currentFace.width)*CARDSCALE/2}vw`,
                top:`${0.2 + (1.39-currentFace.height)*CARDSCALE/2}vw`,
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
