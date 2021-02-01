import React, { Component } from "react";
import styled from "@emotion/styled";
import Stacks from "./Stacks";
import Title from "./Title";
import { GROUPSINFO } from "./Constants";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import { handleBrowseTopN } from "./HandleBrowseTopN";

const Container = styled.div`
  padding: 1px 1px 1px 1px;
  max-height: 100%;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  align-items: center;
  justify-content: center;
  color: white;
  height: 13%;
`;

const WidthContainer = styled.div`
  padding: 2px 2px 2px 0.5vw;
  float: left;
  height: 100%;
`;

const GroupComponent = React.memo(({
  group,
  gameBroadcast,
  chatBroadcast,
  showTitle,
  setBrowseGroupID,
  setBrowseGroupTopN,
}) => {

  const handleMenuClick = (e, data) => {
    if (data.action === "shuffle_group") {
      gameBroadcast("shuffle_group", {group_id: group.id})
      chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+"."})
    } else if (data.action === "move_stacks") {
      if (data.position === "t") {
        gameBroadcast("move_stacks", {orig_group_id: group.id, dest_group_id: data.destGroupID, position: data.position})
        chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to top of "+GROUPSINFO[data.destGroupID].name+"."})
      } else if (data.position === "b") {
        gameBroadcast("move_stacks", {orig_group_id: group.id, dest_group_id: data.destGroupID, position: data.position})
        chatBroadcast("game_update",{message: "moved "+GROUPSINFO[group.id].name+" to bottom of "+GROUPSINFO[data.destGroupID].name+"."})
      } else if (data.position === "s") {
        gameBroadcast("move_stacks", {orig_group_id: group.id, dest_group_id: data.destGroupID, position: data.position})
        chatBroadcast("game_update",{message: "shuffled "+GROUPSINFO[group.id].name+" into "+GROUPSINFO[data.destGroupID].name+"."})
      }
    } else if (data.action === "look_at") {
      const topNstr = data.topN;
      handleBrowseTopN(
        topNstr, 
        group,
        "Player1",
        gameBroadcast, 
        chatBroadcast,
        setBrowseGroupID,
        setBrowseGroupTopN
      ) 
    }
  }
  const numStacks = group["stacks"].length;
  return(
    <Container>
      <ContextMenuTrigger id={group.id} holdToDisplay={0}>
        <Header>
          <Title>{group.name} <FontAwesomeIcon className="text-white" icon={faChevronDown}/></Title>
        </Header>
      </ContextMenuTrigger> 

      <ContextMenu id={group.id} style={{zIndex:1e6}}>
      {/* {stack.cards.map((card, cardIndex) => ( */}
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
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gPlayer1Deck", position: "t"}}>Top </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gPlayer1Deck", position: "b"}}>Bottom </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gPlayer1Deck", position: "s"}}>Shuffle in </MenuItem>
              </SubMenu>
              <SubMenu title='Encounter Deck'>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck", position: "t"}}>Top </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck", position: "b"}}>Bottom </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck", position: "s"}}>Shuffle in </MenuItem>
              </SubMenu>
              <SubMenu title='Encounter Deck 2 &nbsp;'>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck1", position: "t"}}>Top </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck1", position: "b"}}>Bottom </MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck1", position: "s"}}>Shuffle in </MenuItem>
              </SubMenu>
              <SubMenu title='Encounter Deck 3 &nbsp;'>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck2", position: "t"}}>Top</MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck2", position: "b"}}>Bottom</MenuItem>
                  <MenuItem onClick={handleMenuClick} data={{action: 'move_stacks', destGroupID: "gSharedEncounterDeck2", position: "s"}}>Shuffle in</MenuItem>
              </SubMenu>
          </SubMenu>
      </ContextMenu>

      <Stacks
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        group={group}
        isCombineEnabled={group.type === "play"}
        selectedStackIndices={[...Array(numStacks).keys()]}
      />
    </Container>
  )


})

export class GroupView extends Component {

  shouldComponentUpdate = (nextProps, nextState) => {
        // if (nextProps.group.id == "gSharedStaging") {
        //   console.log("prev",JSON.stringify(this.props.group.stacks[0].cards[0].exhausted),JSON.stringify(this.props.group.stacks[1].cards[0].exhausted))
        //   console.log("next",JSON.stringify(nextProps.group.stacks[0].cards[0].exhausted),JSON.stringify(nextProps.group.stacks[1].cards[0].exhausted))
        // }
              //if (nextProps.group.updated === false) {
      if (JSON.stringify(nextProps.group)===JSON.stringify(this.props.group)) {

        return false;
//      } else if {

      } else {
        // console.log('this.props.group');
        // console.log(this.props.group);
        // console.log('nextProps.group');
        // console.log(nextProps.group);
        return true;
      }
  };

  render() {
    const group = this.props.group;
    if (group) {
      console.log('rendering',group.id);
      return (
        // <Draggable draggableId={title} index={index}>
        //   {(provided, snapshot) => (ref={provided.innerRef} {...provided.draggableProps}>

        <GroupComponent
          group={this.props.group}
          gameBroadcast={this.props.gameBroadcast}
          chatBroadcast={this.props.chatBroadcast}
          showTitle={this.props.showTitle}
          setBrowseGroupID={this.props.setBrowseGroupID}
          setBrowseGroupTopN={this.props.setBrowseGroupTopN}
        ></GroupComponent>

        //   )}
        // </Draggable>
      );

    } else {
      return (<div></div>)
    }
  }
}

export class GroupContainer extends Component {
  render() {
    if (this.props.group) {
      const beingBrowsed = this.props.browseGroupID === this.props.group.id;
      return (
        <WidthContainer 
          style={{
            width: this.props.width, 
            visibility: beingBrowsed ? "hidden" : "visible"
          }}>
          {beingBrowsed? <div></div> :
            <div style={{width:"100%", height:"100%"}}>
              <GroupView 
                group={this.props.group} 
                gameBroadcast={this.props.gameBroadcast} 
                chatBroadcast={this.props.chatBroadcast}
                setBrowseGroupID={this.props.setBrowseGroupID}
                setBrowseGroupTopN={this.props.setBrowseGroupTopN}
              ></GroupView>
            </div>
          }

        </WidthContainer>
      )
    } else {
      return (<div></div>)
    }
  }
}