import React, { Component } from "react";
import styled from "@emotion/styled";
import Stacks from "./Stacks";
import Title from "./Title";
import { GROUPSINFO } from "./Constants";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";

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


const GroupComponent = React.memo(({
  group,
  gameBroadcast,
  chatBroadcast,
  showTitle,
  browseGroupIndices,
  setBrowseGroupID,
  setBrowseGroupIndices,
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
      setBrowseGroupID(group.id);
      setBrowseGroupIndices(data.indices);
    }
  }
  const stacks = group["stacks"];
  const browseGroupIndices2 = [1,2,3];
  const selectedStacks = stacks.filter((x,i) => browseGroupIndices2.includes(i));
  for (var i=0; i<selectedStacks.length; i++) {
    const stack = selectedStacks[i];
    const cards = stack["cards"]
    const card = cards[0];
    const faceupCard = {...card, currentSide: "A"};
    cards[0] = faceupCard;
    const faceupStack = {...stack, cards: cards};
    selectedStacks[i] = faceupStack;
  }
  const faceupGroup = {
      ...group, 
      type: "hand",
      stacks: selectedStacks, 
    } 
  return(
    <Container>
      <Header>
        <Title>Browsing: {group.name}</Title>
      </Header>

    <div style={{height:"100%"}}>
      <div style={{width:"75%", height:"100%", float:"left"}}>
      <Stacks
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        group={faceupGroup}
        isCombineEnabled={false}
      />
      </div>
      <div style={{width:"25%", height:"80%", backgroundColor:"red", float:"left"}}>

      </div>
    </div>
    </Container>
  )


})

export default class GroupView extends Component {

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
          setBrowseGroupIndices={this.props.setBrowseGroupIndices}
        ></GroupComponent>

        //   )}
        // </Draggable>
      );

    } else {
      return (<div></div>)
    }
  }
}