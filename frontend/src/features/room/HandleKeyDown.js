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
import { gameAction } from "./Actions";
import { get } from "https";

// const keyTokenMap: { [id: string] : Array<string | number>; } = {
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
    "Escape": "remove_targets",
}

const shiftKeyGameActionMap = {
    "LeftArrow": "undo_many",
    "RightArrow": "redo_many",
}

const keyTokenMap = {
  "1": ["resource",1],
  "2": ["progress",1],
  "3": ["damage",1],
  "4": ["time",1],
  "5": ["willpowerThreat",1],
  "6": ["attack",1],
  "7": ["defense",1],
  "8": ["hitPoints",1],
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

    const checkAlerts = async () => {
        const res = await axios.get("/be/api/v1/alerts");
        console.log("resalerts", res);
        if (res.data && res.data.message) {
            alert(res.data.message + " Time remaining: "+res.data.minutes_remaining + " minutes");
        }
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
        //else setKeypress({"Shift": false});
        if (k === "Control") setKeypress({"Control": true});
        if (k === "Tab") setKeypress({"Tab": true});
        if (k === " ") setKeypress({"Space": true});
        //else setKeypress({"Control": false});

        const isHost = playerN === leftmostNonEliminatedPlayerN(gameUi);
        const props = {gameUi, playerN, gameBroadcast, chatBroadcast, setActiveCardAndLoc};

        // General hotkeys
        if (keypress["Shift"] && Object.keys(shiftKeyGameActionMap).includes(k)) gameAction(shiftKeyGameActionMap[k], props);
        else if (Object.keys(keyGameActionMap).includes(k)) gameAction(keyGameActionMap[k], props);

        // Card specific hotkeys
        if (activeCardAndLoc && activeCardAndLoc.card) {  
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

            // Increment token 
            if (keyTokenMap[k] !== undefined) {
                var tokenType = keyTokenMap[k][0];
                tokenType = processTokenType(tokenType, activeCard);
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
            // Set tokens to 0
            else if (k === "0" && groupType === "play") {
                var newTokens = tokens;
                for (var tokenType in newTokens) {
                    if (newTokens.hasOwnProperty(tokenType)) {
                        newTokens = {...newTokens, [tokenType]: 0};
                        //newTokens[tokenType] = 0; 
                    }
                }
                const updates = [["game","cardById",activeCardId,"tokens", newTokens]];
                dispatch(setValues({updates: updates}))
                gameBroadcast("game_action", {action:"update_values", options:{updates: updates}});
                chatBroadcast("game_update", {message: "cleared all tokens from "+displayName+"."});
            }
            // Exhaust card
            else if (k === "a" && groupType === "play") {
                if (activeCardFace.type === "Location") {
                    chatBroadcast("game_update", {message: "made "+displayName+" the active location."});
                    gameBroadcast("game_action", {action: "move_stack", options: {stack_id: stackId, dest_group_id: "sharedActive", dest_stack_index: 0, combine: false, preserve_state: false}})
                } else {
                    var values = [true, 90];
                    if (activeCard.exhausted) {
                        values = [false, 0];
                        chatBroadcast("game_update", {message: "readied "+displayName+"."});
                    } else {
                        chatBroadcast("game_update", {message: "exhausted "+displayName+"."});
                    }
                    const updates = [["game", "cardById", activeCardId, "exhausted", values[0]], ["game", "cardById", activeCardId, "rotation", values[1]]];
                    dispatch(setValues({updates: updates}));
                    gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                }
            }
            // Flip card
            else if (k === "f") {
                var newSide = "A";
                if (activeCard["currentSide"] === "A") newSide = "B";
                const updates = [["game","cardById",activeCardId,"currentSide", newSide]]
                dispatch(setValues({updates: updates}))
                gameBroadcast("game_action", {action: "flip_card", options:{card_id: activeCardId}});
                if (displayName==="player card" || displayName==="encounter card") {
                    chatBroadcast("game_update", {message: "flipped "+getDisplayName(activeCard)+" faceup."});
                } else {
                    chatBroadcast("game_update", {message: "flipped "+displayName+" over."});
                }
                // Force refresh of GiantCard
                setActiveCardAndLoc({
                    ...activeCardAndLoc,
                    card: {
                        ...activeCardAndLoc.card,
                        currentSide: newSide
                    }
                });
            }
            else if (k === "q" || k==="Q") {
                const playerController = activeCard.controller;
                if (playerController === "shared") return;
                var questingStat = "willpower";
                if (game.questMode === "Battle") questingStat = "attack";
                if (game.questMode === "Siege")  questingStat = "defense";
                // Commit to quest and exhaust
                if (k === "q" && groupType === "play" && !activeCard["committed"] && !activeCard["exhausted"] && !keypress["Control"]) {
                    // const currentWillpower = game.playerData[playerN].willpower;
                    // const newWillpower = currentWillpower + getCardWillpower(activeCard);
                    const willpowerIncrement = activeCardFace[questingStat] + activeCard.tokens[questingStat];
                    const currentWillpower = game.playerData[playerController].willpower;
                    const newWillpower = currentWillpower + willpowerIncrement;
                    const updates = [
                        ["game", "cardById", activeCardId, "committed", true], 
                        ["game", "cardById", activeCardId, "exhausted", true], 
                        ["game", "cardById", activeCardId, "rotation", 90],
                        ["game", "playerData", playerController, "willpower", newWillpower],
                    ];
                    chatBroadcast("game_update", {message: "committed "+displayName+" to the quest."});
                    dispatch(setValues({updates: updates}));
                    gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                }
                // Commit to quest without exhausting
                else if (k === "Q" && groupType === "play" && !activeCard["committed"] && !activeCard["exhausted"] && !keypress["Control"]) {
                    const willpowerIncrement = activeCardFace[questingStat] + activeCard.tokens[questingStat];
                    const currentWillpower = game.playerData[playerController].willpower;
                    const newWillpower = currentWillpower + willpowerIncrement;
                    const updates = [["game", "cardById", activeCardId, "committed", true], ["game", "playerData", playerController, "willpower", newWillpower]];
                    chatBroadcast("game_update", {message: "committed "+displayName+" to the quest without exhausting."});
                    dispatch(setValues({updates: updates}));
                    gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                }
                // Uncommit to quest and ready
                else if (k === "q" && groupType === "play" && activeCard["committed"]) {
                    console.log("uncommit to quest")
                    const willpowerIncrement = activeCardFace[questingStat] + activeCard.tokens[questingStat];
                    const currentWillpower = game.playerData[playerController].willpower;
                    const newWillpower = currentWillpower - willpowerIncrement;
                    const updates = [
                        ["game", "cardById", activeCardId, "committed", false], 
                        ["game", "cardById", activeCardId, "exhausted", false], 
                        ["game", "cardById", activeCardId, "rotation", 0],
                        ["game", "playerData", playerController, "willpower", newWillpower]
                    ];
                    chatBroadcast("game_update", {message: "uncommitted "+displayName+" to the quest."});
                    if (activeCard["exhausted"]) chatBroadcast("game_update", {message: "readied "+displayName+"."});
                    dispatch(setValues({updates: updates}));
                    gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                }
                // Uncommit to quest without readying
                else if (k === "Q" && groupType === "play" && activeCard["committed"]) {
                    console.log("uncommit to quest")
                    const willpowerIncrement = activeCardFace[questingStat] + activeCard.tokens[questingStat];
                    const currentWillpower = game.playerData[playerController].willpower;
                    const newWillpower = currentWillpower - willpowerIncrement;
                    const updates = [["game", "cardById", activeCardId, "committed", false], ["game", "playerData", playerController, "willpower", newWillpower]];
                    chatBroadcast("game_update", {message: "uncommitted "+displayName+" to the quest."});
                    dispatch(setValues({updates: updates}));
                    gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                }

                if (isHost && game.roundStep !== "3.2") {            
                    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "3.2"], ["game", "phase", "Quest"]]}});
                    chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("3.2")+"."});
                }
            }
            // Deal shadow card
            else if (k === "s" && groupType === "play") {
                const encounterStackIds = game.groupById.sharedEncounterDeck.stackIds;
                const stacksLeft = encounterStackIds.length;
                // If no cards, check phase of game
                if (stacksLeft === 0) {
                    chatBroadcast("game_update",{message: " tried to deal a shadow card, but the encounter deck is empty."});
                } else {
                    gameBroadcast("game_action", {action: "deal_shadow", options:{card_id: activeCardId}});
                    chatBroadcast("game_update", {message: "dealt a shadow card to "+displayName+"."});
                }
            }
            // Add target to card
            else if (k === "t") {
                const targetingPlayerN = activeCard.targeting[playerN];
                var values = [true];
                if (targetingPlayerN) {
                    values = [false]
                    chatBroadcast("game_update", {message: "removed target from "+displayName+"."});
                } else {
                    values = [true]
                    chatBroadcast("game_update", {message: "targeted "+displayName+"."});
                }
                const updates = [["game", "cardById", activeCardId, "targeting", playerN, values[0]]];
                dispatch(setValues({updates: updates}));
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
            }
            // Send to victory display
            else if (k === "v") {
                chatBroadcast("game_update", {message: "added "+displayName+" to the victory display."});
                gameBroadcast("game_action", {action: "move_card", options: {card_id: activeCardId, dest_group_id: "sharedVictory", dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                // Clear GiantCard
                setActiveCardAndLoc(null);
            }
            // Send to appropriate discard pile
            else if (k === "x") {
                // If card is the parent card of a stack, discard the whole stack
                if (cardIndex === 0) {
                    const stack = getStackByCardId(game.stackById, activeCardId);
                    if (!stack) return;
                    const cardIds = stack.cardIds;
                    for (var cardId of cardIds) {
                        const cardi = game.cardById[cardId];
                        const discardGroupId = cardi["discardGroupId"];
                        chatBroadcast("game_update", {message: "discarded "+getDisplayName(cardi)+" to "+GROUPSINFO[discardGroupId].name+"."});
                        gameBroadcast("game_action", {action: "move_card", options: {card_id: cardId, dest_group_id: discardGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                    }
                // If the card is a child card in a stack, just discard that card
                } else {
                    const discardGroupId = activeCard["discardGroupId"]
                    chatBroadcast("game_update", {message: "discarded "+displayName+" to "+GROUPSINFO[discardGroupId].name+"."});
                    gameBroadcast("game_action", {action: "move_card", options: {card_id: activeCardId, dest_group_id: discardGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                }
                // If the card was a quest card, load the next quest card
                if (activeCardFace.type === "Quest") {
                    const questDeckStackIds = game.groupById[activeCard.loadGroupId]?.stackIds;
                    if (questDeckStackIds?.length > 0) {
                        chatBroadcast("game_update", {message: "advanced the quest."});
                        gameBroadcast("game_action", {action: "move_stack", options: {stack_id: questDeckStackIds[0], dest_group_id: groupId, dest_stack_index: stackIndex, dest_card_index: 0, combine: false, preserve_state: false}})
                    }
                }
                // Clear GiantCard
                setActiveCardAndLoc(null);
                //dispatch(setGame(game));
            }
            // Shufle card into owner's deck
            else if (k === "h") {
                // determine destination groupId
                var destGroupId = "sharedEncounterDeck";
                if (activeCard.owner === "player1") destGroupId = "player1Deck";
                else if (activeCard.owner === "player2") destGroupId = "gPlayer2Deck";
                else if (activeCard.owner === "player3") destGroupId = "gPlayer3Deck";
                else if (activeCard.owner === "player4") destGroupId = "gPlayer4Deck";
                gameBroadcast("game_action", {action: "move_card", options: {card_id: activeCardId, dest_group_id: destGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: destGroupId}})
                chatBroadcast("game_update", {message: "shuffled "+displayName+" from "+GROUPSINFO[groupId].name+" into "+GROUPSINFO[destGroupId].name+"."})
                // Clear GiantCard
                setActiveCardAndLoc(null);
            }
            // Draw an arrow
            else if (k === "w") {
                // Determine if this is the start or end of the arrow
                if (drawingArrowFrom) {
                    const drawingArrowTo = activeCardId;
                    const oldArrows = game.playerData[playerN].arrows;
                    const newArrows = oldArrows.concat([[drawingArrowFrom, drawingArrowTo]]);
                    //const updates = [["game", "cardById", drawingArrowFrom, "arrowIds", newArrowIds]];
                    const updates = [["game", "playerData", playerN, "arrows", newArrows]];
                    dispatch(setValues({updates: updates}));
                    gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                    setDrawingArrowFrom(null);
                } else {
                    setDrawingArrowFrom(activeCardId);
                }
            }
        }
    }
    return (null);
}