import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSetTouchAction, useTouchAction } from "../../contexts/TouchActionContext";
import { gameAction, cardAction } from "./Actions";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { useKeypress, useSetKeypress } from "../../contexts/KeypressContext";
import { getDisplayName, processTokenType, tokenPrintName } from "./Helpers";
import { useDropdownMenu, useSetDropdownMenu } from "../../contexts/DropdownMenuContext";


export const HandleTouchActions = ({
    playerN,
    gameBroadcast, 
    chatBroadcast
}) => {
    const gameUiStore = state => state?.gameUi;
    const gameUi = useSelector(gameUiStore);
    const touchAction = useTouchAction();
    const setTouchAction = useSetTouchAction();
    const activeCardAndLoc = useActiveCard();
    const setActiveCardAndLoc = useSetActiveCard();
    const dropdownMenu = useDropdownMenu();
    const setDropdownMenu = useSetDropdownMenu();
    const [currentDropdownMenuCardId, setCurrentDropdownMenuCardId] = useState(null);
    const keypress = useKeypress();
    const setKeypress = useSetKeypress();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("trace action handletouch");
        if (touchAction?.type === "game") {
            const action = touchAction?.action;
            gameAction(action, {gameUi, playerN, gameBroadcast, chatBroadcast, activeCardAndLoc, setActiveCardAndLoc, dispatch, keypress, setKeypress})
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
                    if (tokensLeft <= 1) setTouchAction(null);
                    else if (hasToken) {
                        setTouchAction({...touchAction, options: {...options, tokensLeft: tokensLeft - 1}})
                    }
                }
            } else {
                cardAction(action, {gameUi, playerN, gameBroadcast, chatBroadcast, activeCardAndLoc, setActiveCardAndLoc, dispatch, keypress, setKeypress})
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

    return null;
}