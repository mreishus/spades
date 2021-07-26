import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GROUPSINFO, PHASEINFO, roundStepToText, nextRoundStepPhase } from "./Constants";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { setValues } from "./gameUiSlice";
import axios from "axios";
import { 
    getDisplayName, 
    getDisplayNameFlipped, 
    getNextPlayerN, 
    leftmostNonEliminatedPlayerN, 
    getGroupIdStackIndexCardIndex,
    getStackByCardId,
    getCurrentFace,
    processTokenType,
    tokenPrintName,
} from "./Helpers";
import { gameAction, cardAction } from "./Actions";
import { get } from "https";

// const keyTokenMap: { [id: string] : Array<string | number>; } = {
const keyCardActionMap = {
    "0": "zero_tokens",
    "a": "toggle_exhaust",
    "f": "flip",
    "q": "commit",
    "h": "shuffle_into_deck",
    "w": "draw_arrow",
    "Q": "commit_without_exhausting",
    "s": "deal_shadow",
    "t": "target",
    "v": "victory",
    "x": "discard",
}

const keyGameActionMap = {
    "d": "draw",
    "e": "reveal",
    "E": "reveal_facedown",
    "k": "reveal_second",
    "K": "reveal_second_facedown",
    "R": "refresh",
    "N": "new_round",
    "P": "save",
    "S": "shadows",
    "X": "discard_shadows",
    "ArrowLeft": "undo",
    "ArrowRight": "redo",
    "ArrowDown": "next_step",
    "M": "mulligan",
    "Escape": "clear_targets",
}

const shiftKeyGameActionMap = {
    "ArrowLeft": "undo_many",
    "ArrowRight": "redo_many",
}

const keyTokenMap = {
  "1": "resource",
  "2": "progress",
  "3": "damage",
  "4": "time",
  "5": "willpowerThreat",
  "6": "attack",
  "7": "defense",
  "8": "hitPoints",
}

const keyLogBase = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
}

var delayBroadcast;

export const HandleKeyDown = ({
    playerN,
    typing, 
    keypress,
    setKeypress, 
    gameBroadcast, 
    chatBroadcast
}) => {
    const gameUiStore = state => state?.gameUi;
    const gameUi = useSelector(gameUiStore);
    const game = gameUi.game;
    const dispatch = useDispatch();
    const [drawingArrowFrom, setDrawingArrowFrom] = useState(null);

    const activeCardAndLoc = useActiveCard();
    const setActiveCardAndLoc = useSetActiveCard();

    const [keyBackLog, setKeyBackLog] = useState({});
    console.log("Rendering HandleKeyDown", keyBackLog)

    const keyTokenAction = (rawTokenType, props) => {
        const {gameUi, playerN, gameBroadcast, chatBroadcast, activeCardAndLoc, setActiveCardAndLoc, dispatch, keypress, setKeypress} = props;       
        if (!gameUi || !playerN || !activeCardAndLoc || !activeCardAndLoc.card) return; 
        const activeCardId = activeCardAndLoc.card.id; 
        const activeCard = game.cardById[activeCardId];
        if (!activeCard) return;
        const activeCardFace = getCurrentFace(activeCard);
        const displayName = getDisplayName(activeCard);
        const tokens = activeCard.tokens;
        const gsc = getGroupIdStackIndexCardIndex(game, activeCardId);
        const groupId = gsc.groupId;
        const stackIndex = gsc.stackIndex;
        const cardIndex = gsc.cardIndex;
        const group = game.groupById[groupId];
        const groupType = group.type;
        const stackId = group.stackIds[stackIndex];
    
        const tokenType = processTokenType(rawTokenType, activeCard);
        // Check if mouse is hoving over top half or bottom half of card
        // Top half will increase tokens, bottom half will decrease
        const mousePosition = activeCardAndLoc.mousePosition;
        var delta = (mousePosition === "top" ? 1 : -1)
        const currentVal = game.cardById[activeCardId].tokens[tokenType];
        var newVal = currentVal + delta;
        if (newVal < 0 && ['resource','damage','progress','time'].includes(tokenType)) return;   
    
        // Increment token 
        var newKeyBackLog;
        if (!keyBackLog[activeCardId]) {
            newKeyBackLog = {
                ...keyBackLog,
                [activeCardId]: {
                    [tokenType]: delta
                }
            }
        } else if (!keyBackLog[activeCardId][tokenType]) {
            newKeyBackLog = {
                ...keyBackLog,
                [activeCardId]: {
                    ...keyBackLog[activeCardId],
                    [tokenType]: delta
                }
            }
        } else {
            newKeyBackLog = {
                ...keyBackLog,
                [activeCardId]: {
                    ...keyBackLog[activeCardId],
                    [tokenType]: keyBackLog[activeCardId][tokenType] + delta
                }
            }
        }
        setKeyBackLog(newKeyBackLog);
        const updates = [["game","cardById",activeCardId,"tokens", tokenType, newVal]];
        dispatch(setValues({updates: updates}))
        if (delayBroadcast) clearTimeout(delayBroadcast);
        delayBroadcast = setTimeout(function() {
            Object.keys(newKeyBackLog).map((cardId, index) => {
                const cardKeyBackLog = newKeyBackLog[cardId];
                const thisDisplayName = getDisplayName(game.cardById[cardId])
                Object.keys(cardKeyBackLog).map((tok, index) => {
                    if (tok === "displayName") return;
                    const val = cardKeyBackLog[tok]; 
                    if (val > 0) {
                        if (val === 1) {
                            chatBroadcast("game_update",{message: "added "+val+" "+tokenPrintName(tok)+" token to "+thisDisplayName+"."});
                        } else {
                            chatBroadcast("game_update",{message: "added "+val+" "+tokenPrintName(tok)+" tokens to "+thisDisplayName+"."});
                        }
                    } else if (val < 0) {
                        if (val === -1) {
                            chatBroadcast("game_update",{message: "removed "+(-val)+" "+tokenPrintName(tok)+" token from "+thisDisplayName+"."});
                        } else {
                            chatBroadcast("game_update",{message: "removed "+(-val)+" "+tokenPrintName(tok)+" tokens from "+thisDisplayName+"."});
                        }                
                    }
                })
                gameBroadcast("game_action", {action:"increment_tokens", options: {card_id: cardId, token_increments: cardKeyBackLog}});
                // Adjust willpower if committed
                if (activeCard.committed && cardKeyBackLog["willpower"] !== null) gameBroadcast("game_action", {action:"increment_willpower", options: {increment: cardKeyBackLog["willpower"]}});
            })
            setKeyBackLog({})
        }, 500);
    }

    useEffect(() => {
        const onKeyDown = (event) => {
            if (typing) return;
            else {
                event.preventDefault();
                handleKeyDown(
                    event, 
                    playerN,
                    keypress, 
                    setKeypress,
                    gameBroadcast, 
                    chatBroadcast,
                )
            }
        }

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameUi, typing, keypress, activeCardAndLoc, keyBackLog]);

    const handleKeyDown = (
        event, 
        playerN,
        keypress, 
        setKeypress,
        gameBroadcast, 
        chatBroadcast,
    ) => {
        if (!playerN) {
            alert("Please sit down to do that.")
            return;
        }
        const k = event.key;
        console.log(k);
        // Keep track of held key
        if (k === "Shift") setKeypress({"Shift": true});
        if (k === "Control") setKeypress({"Control": true});
        if (k === "Tab") setKeypress({"Tab": true});
        if (k === " ") setKeypress({"Space": true});
        //else setKeypress({"Control": false});
        const actionProps = {gameUi, playerN, gameBroadcast, chatBroadcast, activeCardAndLoc, setActiveCardAndLoc, dispatch, keypress, setKeypress};

        // Hotkeys
        if (keypress["Shift"] && Object.keys(shiftKeyGameActionMap).includes(k)) gameAction(shiftKeyGameActionMap[k], actionProps);
        else if (Object.keys(keyGameActionMap).includes(k)) gameAction(keyGameActionMap[k], actionProps);
        else if (Object.keys(keyCardActionMap).includes(k)) cardAction(keyCardActionMap[k], activeCardAndLoc?.card.id, actionProps);
        else if (Object.keys(keyTokenMap).includes(k)) keyTokenAction(keyTokenMap[k], actionProps);

    }

    return (null);

}


