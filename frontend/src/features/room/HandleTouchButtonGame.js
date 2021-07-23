import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useSetTouchAction, useTouchAction } from "../../contexts/TouchActionContext";
import { gameAction } from "./Actions";
import { useSetActiveCard } from "../../contexts/ActiveCardContext";


export const HandleTouchButtonGame = ({
    playerN,
    gameBroadcast, 
    chatBroadcast
}) => {
    const gameUiStore = state => state?.gameUi;
    const gameUi = useSelector(gameUiStore);
    const touchAction = useTouchAction();
    const setTouchAtion = useSetTouchAction();
    const setActiveCardAndLoc = useSetActiveCard();

    useEffect(() => {
        if (touchAction?.type !== "game") return;
        const action = touchAction?.action;
        gameAction(action, {gameUi, playerN, gameBroadcast, chatBroadcast, setActiveCardAndLoc})
        setTouchAtion(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [touchAction, gameUi, playerN]);

    return null;
}