import React, { useEffect} from "react";
import { GROUPSINFO } from "./Constants";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { getDisplayName, getDisplayNameFlipped, getNextPlayerN, leftmostNonEliminatedPlayerN, functionOnMatchingCards } from "./Helpers";

// const keyTokenMap: { [id: string] : Array<string | number>; } = {
const keyTokenMap = {
  "1": ["resource",1],
  "2": ["progress",1],
  "3": ["damage",1],
  "4": ["time",1],
  "5": ["threat",1],
  "6": ["willpower",1],
  "7": ["attack",1],
  "8": ["defense",1],
}

export const HandleKeyDown = ({
    playerN,
    gameUI,
    typing, 
    keypress,
    setKeypress, 
    gameBroadcast, 
    chatBroadcast
}) => {
    const activeCardAndLoc = useActiveCard();
    const setActiveCardAndLoc = useSetActiveCard();

    useEffect(() => {
        const onKeyDown = (event) => {
            handleKeyDown(
                event, 
                playerN,
                gameUI,
                typing, 
                keypress, 
                setKeypress,
                gameBroadcast, 
                chatBroadcast,
            )
        }

        const onKeyUp = (event) => {
        if (event.key === "Shift") setKeypress([""]);
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameUI, typing, keypress, activeCardAndLoc]);

    const handleKeyDown = (
        event, 
        playerN,
        gameUI,
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
        // Keep track of last pressed key
        if (k === "Shift") setKeypress([k]);
        
        // General hotkeys
        if (k === "e" || k === "E") {
            // Check remaining cards in encounter deck
            const sharedEncounterDeck = gameUI["game"]["groupById"]["sharedEncounterDeck"];
            const stacks = sharedEncounterDeck["stacks"];
            const stacksLeft = stacks.length;
            // If no cards, check phase of game
            if (stacksLeft === 0) {
                // If quest phase, shuffle encounter discard pile into deck
                if (gameUI["game"]["phase"] === "pQuest") {
                    gameBroadcast("move_stacks",{
                        orig_group_id: "sharedEncounterDeck",
                        dest_group_id: "sharedStaging", 
                        position: "s",
                    });
                    chatBroadcast("game_update",{message: " shuffles "+GROUPSINFO["sharedEncounterDiscard"].name+" into "+GROUPSINFO["sharedEncounterDeck"].name+"."});
                } else {
                    // If not quest phase, give error message and break
                    chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty and it's not the quest phase."});
                    return;
                }
            }
            // Reveal card
            const topStack = stacks[0];
            if (!topStack) {
                chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty."});
                return;
            }
            const topCard = topStack["cards"][0];
            // Was shift held down? (Deal card facedown)
            const shiftHeld = (k === "E"); // keypress[0] === "Shift";
            const message = shiftHeld ? "added facedown "+getDisplayName(topCard)+" to the staging area." : "revealed "+getDisplayNameFlipped(topCard)+"."
            chatBroadcast("game_update",{message: message});
            gameBroadcast("move_stack",{
                orig_group_id: "sharedEncounterDeck", 
                orig_stack_index: 0, 
                dest_group_id: "sharedStaging", 
                dest_stack_index: -1,
                preserve_state: shiftHeld,
            });
        } else if (k === "d") {
            // Check remaining cards in deck
            const player1Deck = gameUI["game"]["groupById"]["player1Deck"];
            const stacks = player1Deck["stacks"];
            const stacksLeft = stacks.length;
            // If no cards, give error message and break
            if (stacksLeft === 0) {
                chatBroadcast("game_update",{message: " tried to draw a card, but their deck is empty."});
                return;
            }
            // Draw card
            const topStack = stacks[0];
            const topCard = topStack["cards"][0];
            chatBroadcast("game_update",{message: "drew "+getDisplayNameFlipped(topCard)+"."});
            gameBroadcast("move_stack",{
                orig_group_id: "player1Deck", 
                orig_stack_index: 0, 
                dest_group_id: "player1Hand", 
                dest_stack_index: -1,
                preserve_state: false,
            });
        } else if (k === "R") {
            if (gameUI["game"]["round_step"] !== "7.R") {
                gameBroadcast("set_round_step", {phase: "Refresh", round_step: "7.R"}) 
                chatBroadcast("game_update", {message: "set the round step to 7.2-7.4: Ready cards, raise threat, pass P1 token."})
            }
            // Refresh all cards you control
            chatBroadcast("game_update",{message: "refreshes."});
            gameBroadcast("refresh",{player_n: playerN});
            // Raise your threat
            const newThreat = gameUI["game"]["playerData"][playerN]["threat"]+1;
            chatBroadcast("game_update",{message: "raises threat by 1 ("+newThreat+")."});
            gameBroadcast("increment_threat",{player_n: playerN, increment: 1});
            // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
            // This prevents, for example, the token moving multiple times if players refresh at different times.
            if (playerN == leftmostNonEliminatedPlayerN(gameUI)) {
                const firstPlayerN = gameUI["game"]["first_player"];
                const nextPlayerN = getNextPlayerN(gameUI, firstPlayerN);
                // If nextPlayerN is null then it's a solo game, so don't pass the token
                if (nextPlayerN) {
                    gameBroadcast("set_first_player",{player_n: nextPlayerN});    
                    chatBroadcast("game_update",{message: "moved first player token to "+nextPlayerN+"."})
                }
            }
        } else if (k === "N") {
            if (gameUI["game"]["round_step"] !== "1.R") {
                gameBroadcast("set_round_step", {phase: "Resource", round_step: "1.R"}) 
                chatBroadcast("game_update", {message: "set the round step to 1.2 & 1.3: Gain resources and draw cards."})
            }
            // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
            // This prevents, for example, the round number increasing multiple times.
            if (playerN == leftmostNonEliminatedPlayerN(gameUI)) {
                const roundNumber = gameUI["game"]["round_number"];
                const newRoundNumber = roundNumber + 1;
                gameBroadcast("increment_round",{increment: 1});    
                chatBroadcast("game_update",{message: "increased the round number to "+newRoundNumber+"."})
            }
            functionOnMatchingCards(
                gameUI, 
                gameBroadcast, 
                chatBroadcast, 
                [["sideUp","type","Hero"],["card","controller",playerN]],
                "increment_token",
                ["resource", 1],
            )
        }

        // Card specific hotkeys
        if (activeCardAndLoc != null) {   
            const activeCard = activeCardAndLoc.card;
            var newCard = activeCard;
            var updateActiveCard = false;
            const displayName = getDisplayName(activeCard);
            const tokens = activeCard.tokens;
            const groupId = activeCardAndLoc.groupId;
            const stackIndex = activeCardAndLoc.stackIndex;
            const cardIndex = activeCardAndLoc.cardIndex;
            const groupType = gameUI["game"]["groupById"][groupId]["type"];
            // Increment token 
            if (keyTokenMap[k] !== undefined && groupType === "play") {
                const tokenType = keyTokenMap[k][0];
                const mousePosition = activeCardAndLoc.mousePosition;
                var delta;
                if (mousePosition === "top") delta = keyTokenMap[k][1];
                else if (mousePosition === "bottom") delta = -keyTokenMap[k][1];
                else delta = 0;
                const newVal = tokens[tokenType]+delta;
                if (newVal < 0 && ['resource','damage','progress','time'].includes(tokenType)) return;
                gameBroadcast("increment_token",{group_id: activeCardAndLoc.groupId, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex, token_type: tokenType, increment: delta})
                if (delta > 0) {
                    if (delta === 1) {
                        chatBroadcast("game_update",{message: "added "+delta+" "+tokenType+" token to "+displayName+"."});
                    } else {
                        chatBroadcast("game_update",{message: "added "+delta+" "+tokenType+" tokens to "+displayName+"."});
                    }
                } else {
                    if (delta === -1) {
                        chatBroadcast("game_update",{message: "removed "+(-delta)+" "+tokenType+" token from "+displayName+"."});
                    } else {
                        chatBroadcast("game_update",{message: "removed "+(-delta)+" "+tokenType+" tokens from "+displayName+"."});
                    }                
                }
            }
            // Set tokens to 0
            else if (k === "0" && groupType === "play") {
                for (var tokenType in tokens) {
                    if (tokens.hasOwnProperty(tokenType)) {
                        gameBroadcast("increment_token",{group_id: groupId, stack_index: stackIndex, card_index: cardIndex, token_type: tokenType, increment: -tokens[tokenType]})
                    }
                }
                chatBroadcast("game_update", {message: "cleared all tokens from "+displayName+"."});
            }
            // Flip card
            else if (k === "f") {
                if (newCard["currentSide"] === "A") {
                    newCard = {...newCard, current_side: "B"}
                } else {
                    newCard = {...newCard, current_side: "A"}
                }
                gameBroadcast("update_card", {card: newCard, group_id: groupId, stack_index: stackIndex, card_index: cardIndex});
                if (displayName==="player card" || displayName==="encounter card") {
                    chatBroadcast("game_update", {message: "flipped "+getDisplayName(newCard)+" faceup."});
                } else {
                    chatBroadcast("game_update", {message: "flipped "+displayName+" over."});
                }
                updateActiveCard = true;
            }
            // Exhaust card
            else if (k === "a" && groupType === "play") {
                if (activeCard.exhausted) {
                    chatBroadcast("game_update", {message: "readied "+displayName+"."});
                    newCard = {...newCard, exhausted: false, rotation: 0};
                } else {
                    chatBroadcast("game_update", {message: "exhausted "+displayName+"."});
                    newCard = {...newCard, exhausted: true, rotation: 90};
                }
                gameBroadcast("toggle_exhaust", {group_id: activeCardAndLoc.groupId, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
                updateActiveCard = true;
            }
            // Deal shadow card
            else if (k === "s" && groupType == "play") {
                gameBroadcast("deal_shadow", {group_id: activeCardAndLoc.groupId, stack_index: activeCardAndLoc.stackIndex});
                chatBroadcast("game_update", {message: "dealt a shadow card to "+displayName+"."});
            }        
            // Send to appropriate discard pile
            else if (k === "x") {
                // If card is the parent card of a stack, discard the whole stack
                if (cardIndex == 0) {
                    const stack = gameUI["game"]["groupById"][groupId]["stacks"][stackIndex];
                    if (!stack) return;
                    const cards = stack["cards"];
                    for (var i=0; i<cards.length; i++) {
                        const cardi = cards[i]
                        const discardGroupID = cardi["discardgroupid"];
                        chatBroadcast("game_update", {message: "discarded "+getDisplayName(cardi)+" to "+GROUPSINFO[discardGroupID].name+"."});
                        gameBroadcast("move_card",{
                            orig_group_id: groupId, 
                            orig_stack_index: stackIndex, 
                            orig_card_index: cardIndex, 
                            dest_group_id: discardGroupID,
                            dest_stack_index: 0,
                            dest_card_index: 0, 
                            create_new_stack: true
                        });
                    }
                // If the card is a child card in a stack, just discard that card
                } else {
                    const discardGroupID = activeCard["discardgroupid"]
                    chatBroadcast("game_update", {message: "discarded "+displayName+" to "+GROUPSINFO[discardGroupID].name+"."});
                    gameBroadcast("move_card", {
                        orig_group_id: groupId, 
                        orig_stack_index: stackIndex, 
                        orig_card_index: cardIndex, 
                        dest_group_id: discardGroupID, 
                        dest_stack_index: 0, 
                        dest_card_index: 0, 
                        create_new_stack: true
                    })
                }
            }
            // Shufle card into owner's deck
            else if (k === "h") {
                // determine destination groupId
                var destGroupID = "sharedEncounterDeck";
                if (activeCard.owner === "player1") destGroupID = "player1Deck";
                else if (activeCard.owner === "player2") destGroupID = "gPlayer2Deck";
                else if (activeCard.owner === "player3") destGroupID = "gPlayer3Deck";
                else if (activeCard.owner === "player4") destGroupID = "gPlayer4Deck";
                gameBroadcast("move_card", {orig_group_id: groupId, orig_stack_index: stackIndex, orig_card_index: cardIndex, dest_group_id: destGroupID, dest_stack_index: 0, dest_card_index: 0, create_new_stack: true})
                gameBroadcast("shuffle_group", {group_id: destGroupID})
                chatBroadcast("game_update",{message: "shuffled "+displayName+" from "+GROUPSINFO[groupId].name+" into "+GROUPSINFO[destGroupID].name+"."})
            }

            if (updateActiveCard) {
                activeCardAndLoc.setCard(newCard);
                setActiveCardAndLoc({
                    card: newCard, 
                    groupId: activeCardAndLoc.groupId, 
                    stackIndex: activeCardAndLoc.stackIndex, 
                    cardIndex: activeCardAndLoc.cardIndex, 
                    mousePosition: activeCardAndLoc.mousePosition,
                    screenPosition: activeCardAndLoc.screenPosition,
                    setCard: activeCardAndLoc.setCard,
                });
            }
        }
    }
    return (null);
}