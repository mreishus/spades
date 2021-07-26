import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSetTouchAction, useTouchAction } from "../../contexts/TouchActionContext";
import { gameAction, cardAction } from "./Actions";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { useKeypress, useSetKeypress } from "../../contexts/KeypressContext";
import { getCurrentFace, getDisplayName, processTokenType, tokenPrintName } from "./Helpers";
import { useDropdownMenu, useSetDropdownMenu } from "../../contexts/DropdownMenuContext";
import { useTouchMode } from "../../contexts/TouchModeContext";


export const HandleTouchActions = ({
    playerN,
    gameBroadcast, 
    chatBroadcast
}) => {
    const gameUiStore = state => state?.gameUi;
    const gameUi = useSelector(gameUiStore);
    const touchMode = useTouchMode();
    const touchAction = useTouchAction();
    const setTouchAction = useSetTouchAction();
    const activeCardAndLoc = useActiveCard();
    var activeCardGameUi = null;
    if (activeCardAndLoc?.card) activeCardGameUi = gameUi.game.cardById[activeCardAndLoc.card.id];
    const setActiveCardAndLoc = useSetActiveCard();
    const dropdownMenu = useDropdownMenu();
    const setDropdownMenu = useSetDropdownMenu();
    const [currentDropdownMenuCardId, setCurrentDropdownMenuCardId] = useState(null);
    const keypress = useKeypress();
    const setKeypress = useSetKeypress();
    const [prevActive, setPrevActive] = useState(null);
    const dispatch = useDispatch();
    const actionProps = {gameUi, playerN, gameBroadcast, chatBroadcast, activeCardAndLoc, setActiveCardAndLoc, dispatch, keypress, setKeypress};
    console.log("Rendering HandleTouchActions")

    useEffect(() => {
        if (touchAction?.type === "game") {
            const action = touchAction?.action;
            gameAction(action, actionProps)
            setTouchAction(null);
        } else if (touchAction?.type === "card" && activeCardAndLoc?.card) {
            const action = touchAction.action;
            const activeCard = activeCardAndLoc.card;
            if (action === "increment_token") {
                const options = touchAction.options;
                const tokenType = processTokenType(options.tokenType, activeCard);
                const increment = options.increment;
                const hasToken = activeCard.tokens[tokenType] > 0;
                gameBroadcast("game_action", {action:"increment_token", options: {card_id: activeCard.id, token_type: tokenType, increment: increment}});
                if (increment > 0) chatBroadcast("game_update",{message: "added "+increment+" "+tokenPrintName(tokenType)+" token to "+getDisplayName(activeCard)+"."});
                if (increment < 0 && hasToken) chatBroadcast("game_update",{message: "removed "+increment+" "+tokenPrintName(tokenType)+" token from "+getDisplayName(activeCard)+"."});
                const tokensLeft = touchAction.options?.tokensLeft;
                if (tokensLeft >= 0) {
                    if (tokensLeft === 0) setTouchAction(null);
                    else if (tokensLeft === 1 && hasToken)  setTouchAction(null);
                    else if (hasToken) {
                        setTouchAction({...touchAction, options: {...options, tokensLeft: tokensLeft - 1}})
                    }
                }
            } else {
                cardAction(action, activeCard?.id, actionProps);
            }
            setActiveCardAndLoc(null);
        }
    }, [activeCardAndLoc, touchAction, gameUi, playerN]);

    useEffect(() => {
        if (dropdownMenu?.visible === false && dropdownMenu?.card?.id === currentDropdownMenuCardId) {
            setDropdownMenu({...dropdownMenu, visible: true})
        } else {
            setCurrentDropdownMenuCardId(dropdownMenu?.card?.id);
        }
    }, [dropdownMenu]);

    useEffect(() => {
        setActiveCardAndLoc(null);
        setDropdownMenu(null);
    }, [touchAction])

    // Tapping on an already active card makes it perform the default action
    useEffect(() => {
        if (!touchMode) return;
        if (activeCardAndLoc?.card?.id && activeCardAndLoc?.card?.id === prevActive && activeCardAndLoc?.clicked) {
            const activeCard = activeCardAndLoc.card;
            const activeFace = getCurrentFace(activeCard);
            const type = activeFace.type;
            if (activeCard.rotation === -30 && activeCard.currentSide === "B") {
                cardAction("flip", activeCard.id, actionProps);
            } else if (activeCard.rotation === -30 && activeCard.currentSide === "A") {
                cardAction("discard", activeCard.id, actionProps);
            } else if (type === "enemy") {
                gameBroadcast("game_action", {action:"increment_token", options: {card_id: activeCard.id, token_type: "damage", increment: 1}});
                chatBroadcast("game_update",{message: "added 1 damage token to "+getDisplayName(activeCard)+"."});
            } else if (type === "treachery") {
                cardAction("discard", activeCard.id, actionProps);
            } else {
                cardAction("toggle_exhaust", activeCard.id, actionProps);
            } 
        } else {
            setPrevActive(activeCardAndLoc?.card?.id)
        }
    }, [activeCardAndLoc, touchMode])

    // useEffect(() => {
    //     setActiveCardAndLoc({...activeCardAndLoc, card: activeCardGameUi})
    // }, [activeCardGameUi])

    return null;
}