import { GROUPSINFO } from "./Constants";
import { handleBrowseTopN } from "./HandleBrowseTopN";
import { 
  getDisplayName, 
  getGroupIdStackIndexCardIndex,
  getCurrentFace,
} from "./Helpers";

// dropdownMenu is an object that gets populated with infor about a card when a card is pressed, or about a group when a group is pressed.

export const handleDropdownClickCommon = (dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast) => {
  if (dropdownMenu.type === "card") handleDropdownClickCard(dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast)
  else if (dropdownMenu.type === "group") handleDropdownClickGroup(dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast)
  else if (dropdownMenu.type === "firstPlayer") handleDropdownClickFirstPlayer(dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast)
}

export const handleDropdownClickCard = (dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast) => {
  const menuCard = dropdownMenu.card;
  const displayName = getDisplayName(menuCard);
  if (props.action === "detach") {
    gameBroadcast("game_action", {action: "detach", options: {card_id: menuCard.id}})
    chatBroadcast("game_update", {message: "detached "+displayName+"."})
  } else if (props.action === "peek") {
    gameBroadcast("game_action", {action: "peek_card", options: {card_id: menuCard.id, value: true}})
    chatBroadcast("game_update", {message: "peeked at "+displayName+"."})
  } else if (props.action === "unpeek") {
    gameBroadcast("game_action", {action: "peek_card", options: {card_id: menuCard.id, value: false}})
    chatBroadcast("game_update", {message: " stopped peeking at "+displayName+"."})
  } else if (props.action === "lock") {
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "cardById", menuCard.id, "locked", true]]}})
    chatBroadcast("game_update", {message: " locked "+displayName+"."})
  } else if (props.action === "unlock") {
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "cardById", menuCard.id, "locked", false]]}})
    chatBroadcast("game_update", {message: " unlocked "+displayName+"."})
  } else if (props.action === "moveCard") {
    const destGroupTitle = GROUPSINFO[props.destGroupId].name;
    if (props.position === "top") {
      gameBroadcast("game_action", {action: "move_card", options: {card_id: menuCard.id, dest_group_id: props.destGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
      chatBroadcast("game_update",{message: "moved "+displayName+" to top of "+destGroupTitle+"."})
    } else if (props.position === "bottom") {
      gameBroadcast("game_action", {action: "move_card", options: {card_id: menuCard.id, dest_group_id: props.destGroupId, dest_stack_index: -1, dest_card_index: 0, combine: false, preserve_state: false}})
      chatBroadcast("game_update", {message: "moved "+displayName+" to bottom of "+destGroupTitle+"."})
    } else if (props.position === "shuffle") {
      gameBroadcast("game_action", {action: "move_card", options: {card_id: menuCard.id, dest_group_id: props.destGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
      gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: props.destGroupId}})
      chatBroadcast("game_update", {message: "shuffled "+displayName+" into "+destGroupTitle+"."})
    }
  } else if (props.action === "incrementTokenPerRound") {
      const increment = props.increment;
      const tokenType = props.tokenType;
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "cardById", menuCard.id, "tokensPerRound", tokenType, increment]]}})
      chatBroadcast("game_update", {message: "added "+increment+" "+tokenType+" token(s) per round to "+displayName+"."})
  } else if (props.action === "toggleTrigger") {
    const stepId = props.stepId;
    const currentFace = getCurrentFace(menuCard);
    const triggers = [...currentFace.triggers];
    if (triggers.includes(stepId)) {
      const triggerIndex = triggers.indexOf(stepId);
      if (triggerIndex !== -1) triggers.splice(triggerIndex, 1);
      chatBroadcast("game_update", {message: "removed a step "+stepId+" trigger from "+displayName+"."})
      gameBroadcast("game_action", {action: "card_action", options: {action: "remove_trigger", card_id: menuCard.id, options: {round_step: stepId}}})
    } else {
      triggers.push(stepId);
      chatBroadcast("game_update", {message: "added a step "+stepId+" trigger to "+displayName+"."})
      gameBroadcast("game_action", {action: "card_action", options: {action: "add_trigger", card_id: menuCard.id, options: {round_step: stepId}}})
    }
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "cardById", menuCard.id, "sides", menuCard.currentSide, "triggers", triggers]]}})
    
  } else if (props.action === "swapWithTop") {
    const gsc = getGroupIdStackIndexCardIndex(game, menuCard.id);
    const stackIndex = gsc.stackIndex;
    const deckStackIds = game.groupById[playerN+"Deck"].stackIds;
    if (deckStackIds.length > 0) {
        const stackId0 = deckStackIds[0];
        const cardId0 = game.stackById[stackId0].cardIds[0];
        //gameBroadcast("game_action", {action: "swap_card", options: {card_id_1: }})
        gameBroadcast("game_action", {action: "move_card", options: {card_id: menuCard.id, dest_group_id: playerN+"Deck", dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
        gameBroadcast("game_action", {action: "move_card", options: {card_id: cardId0, dest_group_id: playerN+"Hand", dest_stack_index: stackIndex, dest_card_index: 0, combine: false, preserve_state: false}})
        chatBroadcast("game_update", {message: "swapped a card in their hand with the top of their deck."})       
    }
  } else if (props.action === "setRotation") {
    chatBroadcast("game_update", {message: "set rotation of "+displayName+" to "+props.rotation+"."})
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "cardById", menuCard.id, "rotation", props.rotation]]}})
  }
}

export const handleDropdownClickGroup = (dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast) => {
  const group = dropdownMenu.group;
  if (props.action === "shuffle") {
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: group.id}})
    chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+"."})
  } else if (props.action === "makeVisible") {
    const isVisible = game.playerData[playerN].visibleHand; 
    // Make it so future cards added to hand will be visible
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "playerData", playerN, "visibleHand", !isVisible]]}})
    // Make it so all cards currently in hand are visible
    Object.keys(game.playerData).forEach(playerI => {
      if (playerI !== playerN) gameBroadcast("game_action", {action: "peek_at", options: {stack_ids: game.groupById[playerN+"Hand"].stackIds, for_player_n: playerI, value: !isVisible}})  
    });
    if (isVisible) chatBroadcast("game_update",{message: "made their hand hidden."})
    else chatBroadcast("game_update",{message: "made their hand visible."})
    

  } else if (props.action === "chooseRandom") {
    const stackIds = group.stackIds;
    const rand = Math.floor(Math.random() * stackIds.length);
    const randStackId = stackIds[rand];
    gameBroadcast("game_action", {action: "target_stack", options: {stack_id: randStackId}})
    chatBroadcast("game_update",{message: "randomly picked a card in "+GROUPSINFO[group.id].name+"."})
  } else if (props.action === "moveStacks") {
    gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: group.id, dest_group_id: props.destGroupId, top_n: group.stackIds.length,  position: props.position}})
    if (props.position === "top") {
      chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to top of "+GROUPSINFO[props.destGroupId].name+"."})
    } else if (props.position === "bottom") {
      chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to bottom of "+GROUPSINFO[props.destGroupId].name+"."})
    } else if (props.position === "shuffle") {
      chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+" into "+GROUPSINFO[props.destGroupId].name+"."})
    }
  } else if (props.action === "lookAt") {
    const topNstr = props.topN === "X" ? prompt("Enter a number",0) : props.topN;
    handleBrowseTopN(
      topNstr, 
      group,
      playerN,
      gameBroadcast, 
      chatBroadcast,
      dropdownMenu.setBrowseGroupId,
      dropdownMenu.setBrowseGroupTopN,
    ) 
  } else if (props.action === "dealX") {
    var topX = parseInt(prompt("Enter a number",0)) || 0;
    const stackIds = group.stackIds;
    if (topX > stackIds.length) topX = stackIds.length;
    gameBroadcast("game_action", {action: "peek_at", options: {stack_ids: stackIds.slice(0, topX), value: false}});
    if (topX > 0) {
      gameBroadcast("game_action", {action: "move_stack", options: {stack_id: stackIds[0], dest_group_id: playerN+"Play2", dest_stack_index: -1, combine: false, preserve_state: true}})
    }
    for (var i=1; i<topX; i++) {
      gameBroadcast("game_action", {action: "move_stack", options: {stack_id: stackIds[i], dest_group_id: playerN+"Play2", dest_stack_index: -1, combine: true, preserve_state: true}})
    }
    chatBroadcast("game_update",{message: "dealt the top "+topX+" cards of "+GROUPSINFO[group.id].name+" facedown."})
  }
}

export const handleDropdownClickFirstPlayer = (dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast) => {
  gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "firstPlayer", props.action]]}})
  chatBroadcast("game_update",{message: "set first player to "+props.title+"."})
} 