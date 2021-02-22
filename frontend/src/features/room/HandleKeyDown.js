import { getDisplayName, getDisplayNameFlipped } from "./CardView";
import { GROUPSINFO } from "./Constants";

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

export const handleKeyDown = (
    event, 
    gameUI,
    typing, 
    keypress,
    setKeypress, 
    activeCardAndLoc,
    setActiveCardAndLoc, 
    gameBroadcast, 
    chatBroadcast
) => {
    if (typing) return;
    const k = event.key;
    console.log(k);
    // Keep track of last pressed key
    setKeypress([k]);
    // General hotkeys
    if (k === "e" || k === "E") {
        // Check remaining cards in encounter deck
        const gSharedEncounterDeck = gameUI["game"]["groups"]["gSharedEncounterDeck"];
        const stacks = gSharedEncounterDeck["stacks"];
        const stacksLeft = stacks.length;
        // If no cards, check phase of game
        if (stacksLeft === 0) {
            // If quest phase, shuffle encounter discard pile into deck
            if (gameUI["game"]["phase"] === "quest") {
                gameBroadcast("move_stacks",{
                    orig_group_id: "gSharedEncounterDeck",
                    dest_group_id: "gSharedStaging", 
                    position: "s",
                });
                chatBroadcast("game_update",{message: " shuffles "+GROUPSINFO["gSharedEncounterDiscard"].name+" into "+GROUPSINFO["gSharedEncounterDeck"].name+"."});
            } else {
                // If not quest phase, give error message and break
                chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty and it's not the quest phase."});
                return;
            }
        }
        // Reveal card
        const topStack = stacks[0];
        const topCard = topStack["cards"][0];
        // Was shift held down? (Deal card facedown)
        const shiftHeld = keypress[0] === "Shift";
        const message = shiftHeld ? "added facedown "+getDisplayName(topCard)+" to the staging area." : "revealed "+getDisplayNameFlipped(topCard)+"."
        chatBroadcast("game_update",{message: message});
        gameBroadcast("move_stack",{
            orig_group_id: "gSharedEncounterDeck", 
            orig_stack_index: 0, 
            dest_group_id: "gSharedStaging", 
            dest_stack_index: -1,
            preserve_state: shiftHeld,
        });
    } else if (k === "d") {
        // Check remaining cards in deck
        const gPlayer1Deck = gameUI["game"]["groups"]["gPlayer1Deck"];
        const stacks = gPlayer1Deck["stacks"];
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
            orig_group_id: "gPlayer1Deck", 
            orig_stack_index: 0, 
            dest_group_id: "gPlayer1Hand", 
            dest_stack_index: -1,
            preserve_state: false,
        });
    }

    // Card specific hotkeys
    if (activeCardAndLoc != null) {   
        var newCard = activeCardAndLoc.card;
        var newTokens = newCard.tokens;
        var cardChanged = false;
        const displayName = getDisplayName(newCard);
        const groupID = activeCardAndLoc.groupID;
        const stackIndex = activeCardAndLoc.stackIndex;
        const cardIndex = activeCardAndLoc.cardIndex;
        const groupType = gameUI["game"]["groups"][groupID]["type"];
        // Increment token 
        if (keyTokenMap[k] !== undefined && groupType === "play") {
            const tokenType = keyTokenMap[k][0];
            const mousePosition = activeCardAndLoc.mousePosition;
            var delta;
            if (mousePosition === "top") delta = keyTokenMap[k][1];
            else if (mousePosition === "bottom") delta = -keyTokenMap[k][1];
            else delta = 0;
            const newVal = newTokens[tokenType]+delta;
            if (newVal < 0 && ['resource','damage','progress','time'].includes(tokenType)) return;
            newTokens = {...newTokens, [tokenType]: newVal}
            newCard = {...newCard, tokens: newTokens}
            cardChanged = true;
            gameBroadcast("increment_token",{group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex, token_type: tokenType, increment: delta})
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
            for (var tokenType in newTokens) if (newTokens.hasOwnProperty(tokenType)) newTokens = {...newTokens, [tokenType]: 0};
            newCard = {...newCard, tokens: newTokens}
            cardChanged = true;
            gameBroadcast("update_card", {card: newCard, group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
            chatBroadcast("game_update", {message: "cleared all tokens from "+displayName+"."});
        }
        // Flip card
        else if (k === "f") {
            if (newCard.currentSide === "A") {
                newCard = {...newCard, currentSide: "B"}
            } else {
                newCard = {...newCard, currentSide: "A"}
            }
            cardChanged = true;
            gameBroadcast("update_card", {card: newCard, group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
            if (displayName==="player card" || displayName==="encounter card") {
            chatBroadcast("game_update", {message: "flipped "+getDisplayName(newCard)+" faceup."});
            } else {
            chatBroadcast("game_update", {message: "flipped "+displayName+" over."});
            }
        }
        // Exhaust card
        else if (k === "a" && groupType === "play") {
            if (newCard.exhausted) {
            newCard = {...newCard, exhausted: false, rotation: 0}
            chatBroadcast("game_update", {message: "readied "+displayName+"."});
            } else {
            newCard = {...newCard, exhausted: true, rotation: 90}
            chatBroadcast("game_update", {message: "exhausted "+displayName+"."});
            }
            cardChanged = true;
            gameBroadcast("toggle_exhaust", {group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
            //gameBroadcast("update_card", {card: newCard, group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
        }
        // Deal shadow card
        else if (k === "s" && groupType == "play") {
            gameBroadcast("deal_shadow", {group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex});
            chatBroadcast("game_update", {message: "dealt a shadow card to "+displayName+"."});
        }        
        // Send to appropriate discard pile
        else if (k === "x") {
            // If card is the parent card of a stack, discard the whoe stack
            if (cardIndex == 0) {
                const stack = gameUI["game"]["groups"][groupID]["stacks"][stackIndex];
                if (!stack) return;
                const cards = stack["cards"];
                for (var i=0; i<cards.length; i++) {
                    const cardi = cards[i]
                    const discardGroupID = cardi["discardgroupid"];
                    chatBroadcast("game_update", {message: "discarded "+getDisplayName(cardi)+" to "+GROUPSINFO[discardGroupID].name+"."});
                    gameBroadcast("move_card",{
                        orig_group_id: groupID, 
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
                const discardGroupID = newCard["discardgroupid"]
                chatBroadcast("game_update", {message: "discarded "+displayName+" to "+GROUPSINFO[discardGroupID].name+"."});
                gameBroadcast("move_card", {
                    orig_group_id: groupID, 
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

        // if (cardChanged) {
        //     setActiveCardAndLoc({
        //         card: newCard, 
        //         groupID: activeCardAndLoc.groupID, 
        //         stackIndex: activeCardAndLoc.stackIndex, 
        //         cardIndex: activeCardAndLoc.cardIndex, 
        //         mousePosition: activeCardAndLoc.mousePosition,
        //         screenPosition: activeCardAndLoc.screenPosition,
        //     });
        // }
    }
}