import React, { Component, useState } from "react";
import { GROUPSINFO } from "./Constants";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import { handleBrowseTopN } from "./HandleBrowseTopN";

export const GroupContextMenu = React.memo(({
    group,
    gameBroadcast,
    chatBroadcast,
    playerN,
    setBrowseGroupId,
    setBrowseGroupTopN,
}) => {

    const handleMenuClick = (e, data) => {
        if (data.action === "shuffle_group") {
          gameBroadcast("shuffle_group", {group_id: group.id})
          chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+"."})
        } else if (data.action === "move_stacks") {
          gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: group.id, dest_group_id: data.destGroupId, position: data.position}})
          if (data.position === "t") {
            chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to top of "+GROUPSINFO[data.destGroupId].name+"."})
          } else if (data.position === "b") {
            chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to bottom of "+GROUPSINFO[data.destGroupId].name+"."})
          } else if (data.position === "s") {
            chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+" into "+GROUPSINFO[data.destGroupId].name+"."})
          }
        } else if (data.action === "look_at") {
          const topNstr = data.topN;
          handleBrowseTopN(
            topNstr, 
            group,
            playerN,
            gameBroadcast, 
            chatBroadcast,
            setBrowseGroupId,
            setBrowseGroupTopN
          ) 
        }
    }

    return(
      <ContextMenu id={group.id} style={{zIndex:1e8}}>
          <hr></hr>
          <MenuItem onClick={handleMenuClick} data={{action: 'shuffle_group'}}>Shuffle</MenuItem>
          <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: "None"}}>Browse</MenuItem>
          {(1 || group.type === "deck" || group.type === "discard") ?
          (<div>
            <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: "All"}}>Look at all</MenuItem>
            <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: "5"}}>Look at top 5</MenuItem>
            <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: "10"}}>Look at top 10</MenuItem>
          </div>) : null}
          <SubMenu title='Move all to'>
              <SubMenu title='My Deck'>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "player1Deck", position: "t"}}>Top </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "player1Deck", position: "b"}}>Bottom </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "player1Deck", position: "s"}}>Shuffle in </MenuItem>
              </SubMenu>
              <SubMenu title='Encounter Deck'>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck", position: "t"}}>Top </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck", position: "b"}}>Bottom </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck", position: "s"}}>Shuffle in </MenuItem>
              </SubMenu>
              <SubMenu title='Encounter Deck 2 &nbsp;'>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck1", position: "t"}}>Top </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck1", position: "b"}}>Bottom </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck1", position: "s"}}>Shuffle in </MenuItem>
              </SubMenu>
              <SubMenu title='Encounter Deck 3 &nbsp;'>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck2", position: "t"}}>Top</MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck2", position: "b"}}>Bottom</MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupId: "sharedEncounterDeck2", position: "s"}}>Shuffle in</MenuItem>
              </SubMenu>
          </SubMenu>
      </ContextMenu>
    )
})