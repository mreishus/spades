import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GROUPSINFO, PHASEINFO, roundStepToText } from "./Constants";
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
import { get } from "https";

// const keyTokenMap: { [id: string] : Array<string | number>; } = {
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
            handleKeyDown(
                event, 
                playerN,
                typing, 
                keypress, 
                setKeypress,
                gameBroadcast, 
                chatBroadcast,
            )
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
        typing, 
        keypress, 
        setKeypress,
        gameBroadcast, 
        chatBroadcast,
    ) => {
        if (typing) return;
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
        if (k === " ") setKeypress({"Space": true});
        //else setKeypress({"Control": false});

        const isHost = playerN === leftmostNonEliminatedPlayerN(gameUi);

        const hotkeyRefresh = () => {
            if (game.playerData[playerN].refreshed) {
                chatBroadcast("game_update", {message: "tried to refresh, but they already refreshed this round."})
                return;
            }
            // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
            // This prevents, for example, the token moving multiple times if players refresh at different times.
            if (isHost) {
                // Set phase
                gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "7.R"], ["game", "phase", "Refresh"]]}});
                chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("7.R")+"."})
                const firstPlayerN = game.firstPlayer;
                const nextPlayerN = getNextPlayerN(gameUi, firstPlayerN);
                // If nextPlayerN is null then it's a solo game, so don't pass the token
                if (nextPlayerN) {
                    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","firstPlayer", nextPlayerN]]}});    
                    chatBroadcast("game_update",{message: "moved first player token to "+nextPlayerN+"."});
                }
            }
            // Refresh all cards you control
            chatBroadcast("game_update",{message: "refreshes."});
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["controller", playerN], ["locked", false]], 
                    action: "update_card_values", 
                    options: {updates: [["exhausted", false], ["rotation", 0]]}
                }
            });
            // Raise your threat
            const newThreat = game.playerData[playerN].threat+1;
            chatBroadcast("game_update", {message: "raises threat by 1 ("+newThreat+")."});
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "playerData", playerN, "threat", newThreat], ["game", "playerData", playerN, "refreshed", true]]}});
        }

        const hotkeyNewRound = () => {
            // Check if refresh is needed
            if (!game.playerData[playerN].refreshed) hotkeyRefresh();

            // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
            // This prevents, for example, the round number increasing multiple times.
            if (isHost) {
                // Update phase
                gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "phase", "Resource"], ["game", "roundStep", "1.R"]]}})
                chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("1.R")+"."})
                // Update round number
                const roundNumber = gameUi["game"]["roundNumber"];
                const newRoundNumber = parseInt(roundNumber) + 1;
                gameBroadcast("game_action", {action: "update_values", options:{updates:[["game", "roundNumber", newRoundNumber]]}})
                chatBroadcast("game_update",{message: "increased the round number to "+newRoundNumber+"."})
            }
            // Draw a card
            for (var i = 0; i < game.playerData[playerN].cardsDrawn; i++) {
                gameBroadcast("game_action", {action: "draw_card", options: {player_n: playerN}})
                chatBroadcast("game_update",{message: "drew a card."});
            }
            // Add a resource to each hero
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["sides","sideUp","type","Hero"],["controller",playerN], ["groupType","play"]], 
                    action: "increment_token", 
                    options: {token_type: "resource", increment: 1}
                }
            });
            // Reset willpower count and refresh status
            gameBroadcast("game_action", {action: "update_values", options:{updates:[["game", "playerData", playerN, "willpower", 0], ["game", "playerData", playerN, "refreshed", false]]}})
            // Add custom set tokens per round
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["controller",playerN], ["groupType","play"]], 
                    action: "apply_tokens_per_round", 
                    options: {}
                }
            });
            // Uncommit all characters to the quest
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["controller", playerN]], 
                    action: "update_card_values", 
                    options: {updates: [["committed", false]]}
                }
            });
            // Save replay
            gameBroadcast("game_action", {action: "save_replay", options: {}});
            chatBroadcast("game_update",{message: "saved the replay to their profile."});
            // Check for alerts
            checkAlerts();
        }

        // General hotkeys
        if (k === "e" || k === "E") {
            // Check remaining cards in encounter deck
            const encounterStackIds = game.groupById.sharedEncounterDeck.stackIds;
            const encounterDiscardStackIds = game.groupById.sharedEncounterDiscard.stackIds;
            const stacksLeft = encounterStackIds.length;
            // If no cards, check phase of game
            if (stacksLeft === 0) {
                // If quest phase, shuffle encounter discard pile into deck
                if (game.phase === "Quest") {
                    gameBroadcast("game_action",{action:"move_stacks", options:{orig_group_id: "sharedEncounterDiscard", dest_group_id: "sharedEncounterDeck", top_n: encounterDiscardStackIds.length, position: "s"}});
                    chatBroadcast("game_update",{message: " shuffles "+GROUPSINFO["sharedEncounterDiscard"].name+" into "+GROUPSINFO["sharedEncounterDeck"].name+"."});
                    return;
                } else {
                    // If not quest phase, give error message and break
                    chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty and it's not the quest phase."});
                    return;
                }
            }
            // Reveal card
            const topStackId = encounterStackIds[0];
            if (!topStackId) {
                chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty."});
                return;
            }
            const topStack = game.stackById[topStackId];
            const topCardId = topStack["cardIds"][0];
            const topCard = game.cardById[topCardId];
            // Was shift held down? (Deal card facedown)
            const shiftHeld = (k === "E"); // keypress[0] === "Shift";
            const message = shiftHeld ? "added facedown "+getDisplayName(topCard)+" to the staging area." : "revealed "+getDisplayNameFlipped(topCard)+"."
            chatBroadcast("game_update",{message: message});
            gameBroadcast("game_action", {action: "move_stack", options: {stack_id: topStackId, dest_group_id: "sharedStaging", dest_stack_index: -1, combine: false, preserve_state: shiftHeld}})
        } else if (k === "k" || k === "K") {
            // Check remaining cards in encounter deck
            const encounterStackIds = game.groupById.sharedEncounterDeck2.stackIds;
            const encounterDiscardStackIds = game.groupById.sharedEncounterDiscard2.stackIds;
            const stacksLeft = encounterStackIds.length;
            // If no cards, check phase of game
            if (stacksLeft === 0) {
                // If quest phase, shuffle encounter discard pile into deck
                if (game.phase === "Quest") {
                    gameBroadcast("game_action",{action:"move_stacks", options:{orig_group_id: "sharedEncounterDiscard2", dest_group_id: "sharedEncounterDeck2", top_n: encounterDiscardStackIds.length, position: "s"}});
                    chatBroadcast("game_update",{message: " shuffles "+GROUPSINFO["sharedEncounterDiscard2"].name+" into "+GROUPSINFO["sharedEncounterDeck2"].name+"."});
                    return;
                } else {
                    // If not quest phase, give error message and break
                    chatBroadcast("game_update",{message: " tried to reveal a card from the second encounter deck, but the second encounter deck is empty and it's not the quest phase."});
                    return;
                }
            }
            // Reveal card
            const topStackId = encounterStackIds[0];
            if (!topStackId) {
                chatBroadcast("game_update",{message: " tried to reveal a card from the second encounter deck, but second the encounter deck is empty."});
                return;
            }
            const topStack = game.stackById[topStackId];
            const topCardId = topStack["cardIds"][0];
            const topCard = game.cardById[topCardId];
            // Was shift held down? (Deal card facedown)
            const shiftHeld = (k === "K"); // keypress[0] === "Shift";
            const message = shiftHeld ? "added facedown "+getDisplayName(topCard)+" to the staging area from the second encounter deck." : "revealed "+getDisplayNameFlipped(topCard)+" from the second encounter deck."
            chatBroadcast("game_update",{message: message});
            gameBroadcast("game_action", {action: "move_stack", options: {stack_id: topStackId, dest_group_id: "sharedStaging", dest_stack_index: -1, combine: false, preserve_state: shiftHeld}})
        } else if (k === "d") {
            // Check remaining cards in deck
            const playerDeck = game.groupById[playerN+"Deck"];
            const deckStackIds = playerDeck["stackIds"];
            const stacksLeft = deckStackIds.length;
            // If no cards, give error message and break
            if (stacksLeft === 0) {
                chatBroadcast("game_update",{message: " tried to draw a card, but their deck is empty."});
                return;
            }
            // const playerHand = game.groupById[playerN+"Hand"];
            // const handStackIds = playerHand.stackIds;
            // const topStackId = deckStackIds[0];
            // const topCardId = game.stackById[topStackId].cardIds[0];
            // const newHandStackIds = handStackIds.concat(topStackId);
            // const updates = [
            //     ["game","groupById",playerN+"Hand","stackIds",newHandStackIds],
            //     ["game","cardById",topCardId,"currentSide","A"]
            // ];
            // dispatch(setValues({updates: updates}))
            // Draw card
            chatBroadcast("game_update",{message: "drew a card."});
            gameBroadcast("game_action",{action: "draw_card", options: {player_n: playerN}});
            // Save replay
        } else if (k === "P") {
            gameBroadcast("game_action", {action: "save_replay", options: {}});
            chatBroadcast("game_update", {message: "saved the replay to their profile."});
        } else if (k === "S") {
            // Deal all shadow cards
            // Set phase
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "6.2"], ["game", "phase", "Combat"]]}});
            chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("6.2")+"."});
            gameBroadcast("game_action", {action: "deal_all_shadows", options: {}});
        } else if (k === "X") {
            // Discard all shadow cards
            // Set phase
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "6.11"], ["game", "phase", "Combat"]]}});
            chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("6.11")+"."});

            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["rotation", -30]], 
                    action: "discard_card", 
                    options: {}
                }
            });
            chatBroadcast("game_update", {message: "discarded all shadow cards."});
            
        } else if (k === "ArrowLeft") {
            // Undo an action
            if (game.replayStep <= 0) {
                chatBroadcast("game_update", {message: "tried to undo an action, but no previous actions exist."});
            } else {
                if (keypress["Shift"]) {
                    gameBroadcast("game_action", {action: "step_through", options: {size: "round", direction: "undo"}});
                    chatBroadcast("game_update", {message: "rewinds a round."});
                } else {
                    gameBroadcast("game_action", {action: "step_through", options: {size: "single", direction: "undo"}});
                    chatBroadcast("game_update", {message: "pressed undo."});
                }
            }
            // Clear GiantCard
            setActiveCardAndLoc(null);
        } else if (k === "ArrowRight") {
            // Redo an action
            if (game.replayStep >= game.replayLength) {
                chatBroadcast("game_update", {message: "tried to redo an action, but the game is current."});
            } else {
                if (keypress["Shift"]) {
                    gameBroadcast("game_action", {action: "step_through", options: {size: "round", direction: "redo"}});
                    chatBroadcast("game_update", {message: "fast-forwards a round."});
                } else {
                    gameBroadcast("game_action", {action: "step_through", options: {size: "single", direction: "redo"}});
                    chatBroadcast("game_update", {message: "pressed redo."});
                }
            }
            // Clear GiantCard
            setActiveCardAndLoc(null);
        } else if (k === "R") {
            hotkeyRefresh();
        } else if (k === "N") {
            hotkeyNewRound();
        } else if (k === "M") {
            if (window.confirm('Shuffle hand in deck and redraw equal number?')) {
                const hand = game.groupById[playerN+"Hand"];
                const handSize = hand.stackIds.length;
                gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: playerN+"Hand", dest_group_id: playerN+"Deck", top_n: handSize, position: "shuffle"}})
                gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: playerN+"Deck", dest_group_id: playerN+"Hand", top_n: handSize, position: "top"}})
                chatBroadcast("game_update", {message: "shuffled "+handSize+" cards into their deck and redrew an equal number."})
            }
        } else if (k === "Escape") {
            // Remove targets from all cards you targeted
            chatBroadcast("game_update",{message: "removes all targets."});
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["targeting", playerN, true]], 
                    action: "update_card_values", 
                    options: {updates: [["targeting", playerN, false]]}
                }
            });
            gameBroadcast("game_action", {
                action: "update_values", 
                options: {
                    updates:[["game", "playerData", playerN, "arrows", []]], 
                }
            });
        }

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
            if (keyTokenMap[k] !== undefined && groupType === "play") {
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