import React, { Component, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentFace } from "./Helpers"
import { MenuBarShared } from "./MenuBarShared"
import { GROUPSINFO, sectionToLoadGroupId, sectionToDiscardGroupId } from "./Constants";

export const MenuBarSharedContainer = React.memo(() => {
  
    const stagingStore = state => state?.gameUi?.game.groupById.sharedStaging.stackIds;
    const stagingStackIds = useSelector(stagingStore);
    const cardStore = state => state?.gameUi?.game.cardById;
    const cardById = useSelector(cardStore); 
    const stackStore = state => state?.gameUi?.game.stackById;
    const stackById = useSelector(stackStore);  
    const playerDataStore = state => state?.gameUi?.game.playerData;
    const playerData = useSelector(playerDataStore);  
    const roundStore = state => state?.gameUi?.game.roundNumber;
    const round = useSelector(roundStore);    

    var stagingThreat = 0;
    stagingStackIds.forEach(stackId => {
      const stack = stackById[stackId];
      const topCardId = stack.cardIds[0];
      const topCard = cardById[topCardId];
      const currentFace = getCurrentFace(topCard);
      stagingThreat = stagingThreat + currentFace["threat"] + topCard["tokens"]["threat"];
    })

    var totalWillpower = 0;
    for (const playerI in playerData) {
      if (playerData.hasOwnProperty(playerI)) {
          totalWillpower = totalWillpower + playerData[playerI]["willpower"]
      }
    }

    const totalProgress = totalWillpower - stagingThreat;

    return(
      <MenuBarShared 
        round={round}
        threat={stagingThreat}
        progress={totalProgress}
      />
    )
})