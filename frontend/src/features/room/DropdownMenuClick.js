import { GROUPSINFO } from "./Constants";
import { getDisplayName } from "./Helpers";
import { handleBrowseTopN } from "./HandleBrowseTopN";

// dropdownMenu is an object that gets populated with infor about a card when a card is pressed, or about a group when a group is pressed.

export const handleDropdownClickCommon = (dropdownMenu, props, playerN, gameBroadcast, chatBroadcast) => {
  if (dropdownMenu.type === "card") handleDropdownClickCard(dropdownMenu, props, playerN, gameBroadcast, chatBroadcast)
  else if (dropdownMenu.type === "group") handleDropdownClickGroup(dropdownMenu, props, playerN, gameBroadcast, chatBroadcast)
}

export const handleDropdownClickCard = (dropdownMenu, props, playerN, gameBroadcast, chatBroadcast) => {
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
  }
}

export const handleDropdownClickGroup = (dropdownMenu, props, playerN, gameBroadcast, chatBroadcast) => {
  const group = dropdownMenu.group;
  if (props.action === "shuffle") {
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: group.id}})
    chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+"."})
  } else if (props.action === "chooseRandom") {
    const stackIds = group.stackIds;
    const rand = Math.floor(Math.random() * stackIds.length);
    const randStackId = stackIds[rand];
    gameBroadcast("game_action", {action: "target_stack", options: {stack_id: randStackId}})
    chatBroadcast("game_update",{message: "randomly picked a card in "+GROUPSINFO[group.id].name+"."})
  } else if (props.action === "moveStacks") {
    gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: group.id, dest_group_id: props.destGroupId, position: props.position}})
    if (props.position === "top") {
      chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to top of "+GROUPSINFO[props.destGroupId].name+"."})
    } else if (props.position === "bottom") {
      chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to bottom of "+GROUPSINFO[props.destGroupId].name+"."})
    } else if (props.position === "shuffle") {
      chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+" into "+GROUPSINFO[props.destGroupId].name+"."})
    }
  } else if (props.action === "lookAt") {
    const topNstr = props.topN;
    handleBrowseTopN(
      topNstr, 
      group,
      playerN,
      gameBroadcast, 
      chatBroadcast,
      dropdownMenu.setBrowseGroupId,
      dropdownMenu.setBrowseGroupTopN,
    ) 
  }
}

