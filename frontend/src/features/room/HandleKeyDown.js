import { getDisplayName } from "./CardView";

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
    console.log(keypress);
    // General hotkeys
    if (k === "Tab") {
        gameBroadcast("reveal_card",{})
    } else if (k === "Space") {
        gameBroadcast("draw_card",{})
    }

    // Card specific hotkeys
    if (activeCardAndLoc != null) {   
    var newCard = activeCardAndLoc.card;
    var newTokens = newCard.tokens;
    var cardChanged = false;
    const displayName = getDisplayName(newCard);
    // Increment token 
    if (keyTokenMap[k] != undefined) {
        const tokenType = keyTokenMap[k][0];
        const mousePosition = activeCardAndLoc.mousePosition;
        var delta;
        if (mousePosition === "top") {
            delta = keyTokenMap[k][1];
        } else if (mousePosition === "bottom") { 
            delta = -keyTokenMap[k][1];
        } else {
            delta = 0;
        }
        const newVal = newTokens[tokenType]+delta;
        if (newVal < 0 && ['resource','damage','progress','time'].includes(tokenType)) return;
        newTokens = {
            ...newTokens,
            [tokenType]: newVal,
        }
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
    else if (k === "0") {
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
    else if (k === "a") {
        if (newCard.exhausted) {
        newCard = {...newCard, exhausted: false, rotation: 0}
        chatBroadcast("game_update", {message: "readied "+displayName+"."});
        } else {
        newCard = {...newCard, exhausted: true, rotation: 90}
        chatBroadcast("game_update", {message: "exhausted "+displayName+"."});
        }
        cardChanged = true;
        gameBroadcast("update_card", {card: newCard, group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
    }
    // Deal shadow card
    else if (k === "s") {
        gameBroadcast("deal_shadow", {group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex});
        chatBroadcast("game_update", {message: "dealt a shadow card to "+displayName+"."});
    }        
    // Send to appropriate discard pile
    else if (k === "x") {
        console.log('1');
        chatBroadcast("game_update", {message: "discarded "+displayName+" to ."});
        gameBroadcast("discard_card", {group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex});
    }
    if (cardChanged) {
        setActiveCardAndLoc({
        card: newCard, 
        groupID: activeCardAndLoc.groupID, 
        stackIndex: activeCardAndLoc.stackIndex, 
        cardIndex: activeCardAndLoc.cardIndex, 
        mousePosition: activeCardAndLoc.mousePosition
        });
    }
    }
}