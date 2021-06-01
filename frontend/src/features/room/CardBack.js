/* The image shown below the deck of cards*/

import React from "react";
import { useSelector } from 'react-redux';
import { CARDSCALE, LAYOUTINFO} from "./Constants"
import { getCurrentFace, getVisibleFaceSRC } from "./Helpers";
import useProfile from "../../hooks/useProfile";

const CardBack = React.memo(({
    groupType,
    stackIds,
    isDraggingOver,
    isDraggingFrom,
    playerN,
}) => {
  const user = useProfile();
  const storeStack0 = state => state?.gameUi?.game?.stackById[stackIds[0]];
  const stack0 = useSelector(storeStack0);
  const storeStack1 = state => state?.gameUi?.game?.stackById[stackIds[1]];
  const stack1 = useSelector(storeStack1);
  const storeCard0 = state => state?.gameUi?.game?.cardById[stack0?.cardIds[0]];
  const card0 = useSelector(storeCard0);
  const storeCard1 = state => state?.gameUi?.game?.cardById[stack1?.cardIds[0]];
  const card1 = useSelector(storeCard1);  
  const numPlayersStore = state => state.gameUi.game.numPlayers;
  const numPlayers = useSelector(numPlayersStore);
  const layoutStore = state => state.gameUi?.game?.layout;
  const layout = useSelector(layoutStore);
  const layoutInfo = LAYOUTINFO["layout" + numPlayers + layout];
  const numRows = layoutInfo.length;
  const cardSize = CARDSCALE/numRows;

  var visibleFaceSRC;
  var visibleFace;
  const groupSize = stackIds.length;
  if (groupType=="deck" && groupSize>0 && isDraggingOver && !isDraggingFrom) {
    visibleFaceSRC = getVisibleFaceSRC(card0, playerN, user)
    visibleFace = getCurrentFace(card0)
  } else if (groupType=="deck" && groupSize>1 && isDraggingFrom) {
    visibleFaceSRC = getVisibleFaceSRC(card1, playerN, user)
    visibleFace = getCurrentFace(card1)
  } else if (groupType=="discard" && groupSize>0 && isDraggingOver && !isDraggingFrom) {
    visibleFaceSRC = getVisibleFaceSRC(card0, playerN, user)
    visibleFace = getCurrentFace(card0)
  } else if (groupType=="discard" && groupSize>1 && isDraggingFrom) {
    visibleFaceSRC = getVisibleFaceSRC(card1, playerN, user)
    visibleFace = getCurrentFace(card1)
  }
  if (visibleFace) {
    return (
        <div 
            style={{
                backgroundColor: "red",
                background: `url(${visibleFaceSRC}) no-repeat scroll 0% 0% / contain`,
                //borderWidth: '1px',
                borderRadius: '6px',
                borderColor: 'transparent',
                position: "absolute",
                width: `${cardSize*visibleFace.width}vw`,
                height: `${cardSize*visibleFace.height}vw`,
                left: `${0.2 + (1.39-visibleFace.width)*cardSize/2}vw`,
                top: "50%", //`${0.2 + (1.39-currentFace.height)*cardSize/2}vw`,
                transform: "translate(0%,-50%)",
            }}
        >
        </div>)
  } else {
    return (<div></div>);
  }
})

//left: `${0.2 + (1.39-currentFace.width)*CARDSCALE/2 + CARDSCALE/3*cardIndex}vw`,
//top: `${0.2 + (1.39-currentFace.height)*CARDSCALE/2}vw`,

export default CardBack;
