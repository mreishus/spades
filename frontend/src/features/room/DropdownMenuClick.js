import { GROUPSINFO } from "./Constants";
import { getDisplayName } from "./Helpers";

export const handleDropdownClickCommon = (dropdownMenu, props, gameBroadcast, chatBroadcast) => {
  if (dropdownMenu.type === "card") handleDropdownClickCard(dropdownMenu, props, gameBroadcast, chatBroadcast)
  else if (dropdownMenu.type === "group") handleDropdownClickGroup(dropdownMenu, props, gameBroadcast, chatBroadcast)
}

export const handleDropdownClickCard = (dropdownMenu, props, gameBroadcast, chatBroadcast) => {
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

export const handleDropdownClickGroup = (dropdownMenu, props, gameBroadcast, chatBroadcast) => {
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