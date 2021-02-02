import React, { Component, useState } from "react";
import styled from "@emotion/styled";
import Stacks from "./Stacks";
import Title from "./Title";
import { GROUPSINFO } from "./Constants";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import Dropdown from 'react-dropdown';
import { GroupView } from "./GroupView";
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


const BrowseComponent = React.memo(({
  group,
  gameBroadcast,
  chatBroadcast,
  showTitle,
  browseGroupTopN,
  setBrowseGroupID,
  setBrowseGroupTopN,
}) => {
  const [selectedCardType, setSelectedCardType] = useState('All');
  const [selectedCardName, setSelectedCardName] = useState('');
  //const [faceupStackIDs, setFaceupStackIDs] = useState([]);
  const stacks = group["stacks"];

  //var faceupStackIDs = [];
  //browseGroupTopN.forEach(i => {if (stacks[i]) faceupStackIDs.push(stacks[i].id)});
  //setFaceupStackIDs(faceupIDs);

  const handleOptionClick = (event) => {
    console.log(event.target.value);
    setSelectedCardType(event.target.value);
  }

  const handleCloseClick = (event) => {
    setBrowseGroupID("");
    setBrowseGroupTopN(0);
    gameBroadcast("peek_at", {group_id: group.id, stack_indices: [], card_indices: [], player_n: "Player1", reset_peek: true})
  }

  const handleSelectClick = (event) => {
    const topNstr = event.target.value;
    handleBrowseTopN(
      topNstr, 
      group,
      "Player1",
      gameBroadcast, 
      chatBroadcast,
      setBrowseGroupID,
      setBrowseGroupTopN
    )
    // var peekStackIndices = [];
    // var peekCardIndices = [];
    
    // if (topN === "All") {
    //   topN = numStacks;
    //   peekStackIndices = [...Array(topN).keys()];
    //   peekCardIndices = new Array(topN).fill(0);
    //   chatBroadcast("game_update",{message: "looks at "+groupName+"."})
    // } else if (topN === "None") {
    //   topN = numStacks; 
    //   peekStackIndices = [];
    //   peekCardIndices = [];
    //   chatBroadcast("game_update",{message: "stopped looking at "+groupName+"."})
    // } else {
    //   topN = parseInt(topN);
    //   peekStackIndices = [...Array(topN).keys()];
    //   peekCardIndices = new Array(topN).fill(0);
    //   chatBroadcast("game_update",{message: "looks at top "+topN+" of "+groupName+"."})
    // }
    // setBrowseGroupID(group.id);
    // setBrowseGroupTopN(topN);
    // gameBroadcast("peek_at", {group_id: group.id, stack_indices: peekStackIndices, card_indices: peekCardIndices, player_n: 'Player1', reset_peek: true})
  }

  const handleInputTyping = (event) => {
    console.log(event.target.value);
    setSelectedCardName(event.target.value);
    //setSelectedCardType(event.target.value);
  }

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
      setBrowseGroupTopN(data.indices);
    }
  }
  
  // const browseGroupTopN2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
  // var selectedStacks = stacks.filter((s,i) => browseGroupTopN2.includes(i));
  // console.log(selectedStacks);


  // If browseGroupTopN not set, show all stacks
  console.log('browseGroupTopN',browseGroupTopN)
  var filteredStackIndices = browseGroupTopN>=0 ? [...Array(browseGroupTopN).keys()] : [...Array(7).keys()]; 
  // Filter by selected card type
  if (selectedCardType != "All") 
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stacks[s] && 
      stacks[s]["cards"][0]["sides"]["A"]["type"] === selectedCardType &&
      stacks[s]["cards"][0]["peeking"]["Player1"]
    ));
  // Filter by card name
  if (selectedCardName != "")
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stacks[s] && 
      stacks[s]["cards"][0]["sides"]["A"]["printname"].toLowerCase().includes(selectedCardName.toLowerCase()) &&
      stacks[s]["cards"][0]["peeking"]["Player1"]
    ));

  // Flip cards faceup
  // for (var i=0; i<stacks.length; i++) {
  //   var stack = stacks[i];
  //   const cards = stack["cards"]
  //   var card = cards[0];
  //   if (faceupStackIDs.includes(stack.id)) {
  //     card = {...card, currentSide: "A"};
  //   } else {
  //     card = {...card, currentSide: "B"};
  //   }
  //   cards[0] = card;
  //   stack = {...stack, cards: cards};
  //   stacks[i] = stack;
  // }
  const fannedGroup = {
      ...group, 
      type: "hand",
  } 
  return(
    <Container>
      <ContextMenuTrigger id={group.id} holdToDisplay={0}>
        <Header>
          <div style={{width:"100%", height:"20px"}}>
            <Title className="float-left">Browsing: {group.name} <FontAwesomeIcon className="text-white" icon={faChevronDown}/></Title>
            <FontAwesomeIcon className="text-white float-right mr-2 mt-1" icon={faTimes} onClick={handleCloseClick}/>
            
            {/* <div style={{float:"right", height:"100%", width:"20px", backgroundColor:"red"}}>
              <FontAwesomeIcon className="text-white float-left text-right" icon={faTimes}/>
            </div> */}
          </div>
        </Header>
      </ContextMenuTrigger> 

      {/* <ContextMenu id={group.id} style={{zIndex:1e6}}>
          <hr></hr>
          <MenuItem onClick={handleMenuClick} data={{action: 'shuffle_group'}}>Shuffle</MenuItem>
          <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: numStacks}}>Browse</MenuItem>
          {(group.type === "deck" || group.type === "discard") ?
          (<div>
            <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: numStacks}}>Look at all</MenuItem>
            <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: 5}}>Look at top 5</MenuItem>
            <MenuItem onClick={handleMenuClick} data={{action: 'look_at', topN: 10}}>Look at top 10</MenuItem>
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
      </ContextMenu> */}

    {/* <div style={{height:"100%", width:"100%"}}> */}
      <div style={{width:"75%", height:"100%", float:"left"}}>
        <Stacks
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
          group={fannedGroup}
          isCombineEnabled={false}
          selectedStackIndices={filteredStackIndices}
        />
      </div>
      <div style={{width:"25%", height:"80%", float:"left"}}>

        <table style={{width:"100%"}}>
          <body>
            <tr>
              <td onChange={handleSelectClick}>
                <select name="numFaceup" id="numFaceup">
                  <option value="" disabled selected>Look at...</option>
                  <option value="None">None</option>
                  <option value="All">All</option>
                  <option value="5">Top 5</option>
                  <option value="10">Top 10</option>
                </select>
              </td>
              <td>
                <input type="text" id="name" name="name" className="ml-5" placeholder="Card name..." onChange={handleInputTyping}></input>
              </td>
            </tr>
            <tr onChange={handleOptionClick}>
              <td><label className="text-white"><input type="radio" name="cardtype" value="All" defaultChecked/> All</label></td>
              <td><label className="text-white"><input type="radio" name="cardtype" value="Ally"/> Ally</label></td>
            </tr>
            <tr onChange={handleOptionClick}>
              <td><label className="text-white"><input type="radio" name="cardtype" value="Enemy" /> Enemy</label></td>
              <td><label className="text-white"><input type="radio" name="cardtype" value="Attachment" /> Attachment</label></td>
            </tr>
            <tr onChange={handleOptionClick}>
              <td><label className="text-white"><input type="radio" name="cardtype" value="Location" /> Location</label></td>
              <td><label className="text-white"><input type="radio" name="cardtype" value="Event" /> Event</label></td>
            </tr>
            <tr onChange={handleOptionClick}>
              <td><label className="text-white"><input type="radio" name="cardtype" value="Location" /> Treachery</label></td>
              <td><label className="text-white"><input type="radio" name="cardtype" value="Side Quest" /> Side Quest</label></td>
            </tr>
          </body>
        </table> 
      </div>
      {/* </div> */}
    </Container>
  )


})

export class BrowseView extends Component {

//   shouldComponentUpdate = (nextProps, nextState) => {
//         // if (nextProps.group.id == "gSharedStaging") {
//         //   console.log("prev",JSON.stringify(this.props.group.stacks[0].cards[0].exhausted),JSON.stringify(this.props.group.stacks[1].cards[0].exhausted))
//         //   console.log("next",JSON.stringify(nextProps.group.stacks[0].cards[0].exhausted),JSON.stringify(nextProps.group.stacks[1].cards[0].exhausted))
//         // }
//               //if (nextProps.group.updated === false) {
//       if (JSON.stringify(nextProps.group)===JSON.stringify(this.props.group)) {

//         return false;
// //      } else if {

//       } else {
//         // console.log('this.props.group');
//         // console.log(this.props.group);
//         // console.log('nextProps.group');
//         // console.log(nextProps.group);
//         return true;
//       }
//   };

  render() {
    const group = this.props.group;
    if (group) {
      console.log('rendering',group.id);
      return (
        // <Draggable draggableId={title} index={index}>
        //   {(provided, snapshot) => (ref={provided.innerRef} {...provided.draggableProps}>

        <BrowseComponent
          group={this.props.group}
          gameBroadcast={this.props.gameBroadcast}
          chatBroadcast={this.props.chatBroadcast}
          browseGroupTopN={this.props.browseGroupTopN}
          setBrowseGroupID={this.props.setBrowseGroupID}
          setBrowseGroupTopN={this.props.setBrowseGroupTopN}
        ></BrowseComponent>

        //   )}
        // </Draggable>
      );

    } else {
      return (<div></div>)
    }
  }
}

export default class BrowseContainer extends Component {
  render() {
    if (this.props.group) {
      return (
        <WidthContainer style={{width: this.props.width}}>
          <BrowseComponent
            group={this.props.group} 
            gameBroadcast={this.props.gameBroadcast} 
            chatBroadcast={this.props.chatBroadcast}
            browseGroupTopN={this.props.browseGroupTopN}
            setBrowseGroupID={this.props.setBrowseGroupID}
            setBrowseGroupTopN={this.props.setBrowseGroupTopN}
          ></BrowseComponent>
        </WidthContainer>
      )
    } else {
      return (<div></div>)
    }
  }
}