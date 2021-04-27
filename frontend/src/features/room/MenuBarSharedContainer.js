import React, { Component, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentFace } from "./Helpers"
import { MenuBarShared } from "./MenuBarShared"
import { GROUPSINFO, sectionToLoadGroupId, sectionToDiscardGroupId } from "./Constants";

export const MenuBarSharedContainer = React.memo(({setPlayerWillpower}) => {
  
    const stagingStore = state => state?.gameUi?.game?.groupById?.sharedStaging.stackIds;
    const stagingStackIds = useSelector(stagingStore);
    const cardStore = state => state?.gameUi?.game?.cardById;
    const cardById = useSelector(cardStore); 
    const stackStore = state => state?.gameUi?.game?.stackById;
    const stackById = useSelector(stackStore);  
    const playerDataStore = state => state?.gameUi?.game?.playerData;
    const playerData = useSelector(playerDataStore);  
    const roundStore = state => state?.gameUi?.game?.roundNumber;
    const round = useSelector(roundStore);  
    
    if (!stagingStackIds) return;

    var stagingThreat = 0;
    stagingStackIds.forEach(stackId => {
      const stack = stackById[stackId];
      const topCardId = stack.cardIds[0];
      const topCard = cardById[topCardId];
      const currentFace = getCurrentFace(topCard);
      stagingThreat = stagingThreat + currentFace["threat"] + topCard["tokens"]["threat"];
    })

    const playerWillpower = {"player1": 0, "player2": 0, "player3": 0, "player4": 0};
    Object.keys(cardById).forEach((cardId) => {
      const card = cardById[cardId];
      const currentFace = getCurrentFace(card);
      const cardWillpower = currentFace.willpower || 0;
      if (card.committed) {
        playerWillpower[card.controller] += cardWillpower + card.tokens.willpower;
      }
    })
    const totalWillpower = playerWillpower["player1"] + playerWillpower["player2"] + playerWillpower["player3"] + playerWillpower["player4"];
    const totalProgress = totalWillpower - stagingThreat;
    setPlayerWillpower(playerWillpower);

    return(
      <MenuBarShared 
        round={round}
        threat={stagingThreat}
        progress={totalProgress}
      />
    )
})