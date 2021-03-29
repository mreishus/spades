import React, { Component, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import styled from "@emotion/styled";
import { Stacks } from "./Stacks";
import Title from "./Title";
import { GROUPSINFO } from "./Constants";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import Dropdown from 'react-dropdown';
import { GroupView } from "./Group";
import { handleBrowseTopN } from "./HandleBrowseTopN";
import { GroupContextMenu } from "./GroupContextMenu";
import { getParentCardsInGroup } from "./Helpers";

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

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}


export const Browse = React.memo(({
  groupId,
  cardSize,
  gameBroadcast,
  chatBroadcast,
  playerN,
  browseGroupTopN,
  setBrowseGroupId,
  setBrowseGroupTopN,
}) => {
  const gameStore = state => state?.gameUi?.game;
  const game = useSelector(gameStore);
  const group = game["groupById"][groupId];
  const parentCards = getParentCardsInGroup(game, groupId);
  const [selectedCardType, setSelectedCardType] = useState('All');
  const [selectedCardName, setSelectedCardName] = useState('');
  //const [faceupStackIDs, setFaceupStackIDs] = useState([]);
  const stackIds = group["stackIds"];
  const numStacks = stackIds.length;

  //var faceupStackIDs = [];
  //browseGroupTopN.forEach(i => {if (stacks[i]) faceupStackIDs.push(stacks[i].id)});
  //setFaceupStackIDs(faceupIDs);

  const handleOptionClick = (event) => {
    setSelectedCardType(event.target.value);
  }

  const handleCloseClick = (event) => {
    setBrowseGroupId("");
    setBrowseGroupTopN(0);
    gameBroadcast("game_action", {action: "peek_at", options: {player_n: playerN, stack_ids: stackIds, value: false}})
  }

  const handleSelectClick = (event) => {
    const topNstr = event.target.value;
    handleBrowseTopN(
      topNstr, 
      group,
      playerN,
      gameBroadcast, 
      chatBroadcast,
      setBrowseGroupId,
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
    // setBrowseGroupId(group.id);
    // setBrowseGroupTopN(topN);
    // gameBroadcast("peek_at", {group_id: group.id, stack_indices: peekStackIndices, card_indices: peekCardIndices, player_n: 'Player1', reset_peek: true})
  }

  const handleInputTyping = (event) => {
    setSelectedCardName(event.target.value);
    //setSelectedCardType(event.target.value);
  }

  // If browseGroupTopN not set, or equal to "All" or "None", show all stacks
  var browseGroupTopNint = isNormalInteger(browseGroupTopN) ? parseInt(browseGroupTopN) : numStacks;
  var filteredStackIndices = [...Array(browseGroupTopNint).keys()];
  console.log("parentCards")
  console.log(parentCards)
  console.log(filteredStackIndices)
  // Filter by selected card type
  if (selectedCardType != "All") 
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stackIds[s] && 
      parentCards[s]["sides"]["A"]["type"] === selectedCardType &&
      parentCards[s]["peeking"][playerN]
    ));
  console.log(filteredStackIndices)
  // Filter by card name
  if (selectedCardName != "")
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stackIds[s] && 
      parentCards[s]["sides"]["A"]["name"].toLowerCase().includes(selectedCardName.toLowerCase()) &&
      parentCards[s]["peeking"][playerN]
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

  return(
    // <WidthContainer 
    //   style={{
    //     width: width,
    //     // visibility: beingBrowsed ? "hidden" : "visible"
    //   }}>
      <Container>
        <div style={{width:"100%", height:"20px", float:"left"}}>
        <ContextMenuTrigger id={group.id} holdToDisplay={0}>
          <Header className="float-left">
              <Title>Browsing: {GROUPSINFO[group.id].name} <FontAwesomeIcon className="text-white" icon={faChevronDown}/></Title>
          </Header>
        </ContextMenuTrigger> 

        <FontAwesomeIcon className="text-white float-right mr-2 mt-1" icon={faTimes} onClick={handleCloseClick}/>
        </div>
        <GroupContextMenu
          group={group}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
          playerN={playerN}
          setBrowseGroupId={setBrowseGroupId}
          setBrowseGroupTopN={setBrowseGroupTopN}
        ></GroupContextMenu>

      {/* <div style={{height:"100%", width:"100%"}}> */}
        <div style={{width:"75%", height:"100%", float:"left"}}>
          <Stacks
            gameBroadcast={gameBroadcast}
            chatBroadcast={chatBroadcast}
            playerN={playerN}
            groupId={groupId}
            stackIds={stackIds}
            cardSize={cardSize}
            groupType={"hand"}
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
                  <input style={{width:"50%"}} type="text" id="name" name="name" className="ml-5" placeholder="Card name..." onChange={handleInputTyping}></input>
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
    // </WidthContainer>
  )
})

const BrowseComponent = React.memo(({
  group,
  gameBroadcast,
  chatBroadcast,
  showTitle,
  browseGroupTopN,
  setBrowseGroupId,
  setBrowseGroupTopN,
  playerN,
}) => {
  const [selectedCardType, setSelectedCardType] = useState('All');
  const [selectedCardName, setSelectedCardName] = useState('');
  //const [faceupStackIDs, setFaceupStackIDs] = useState([]);
  const stacks = group["stackIds"];
  const numStacks = stacks.length;

  //var faceupStackIDs = [];
  //browseGroupTopN.forEach(i => {if (stacks[i]) faceupStackIDs.push(stacks[i].id)});
  //setFaceupStackIDs(faceupIDs);

  const handleOptionClick = (event) => {
    setSelectedCardType(event.target.value);
  }

  const handleCloseClick = (event) => {
    setBrowseGroupId("");
    setBrowseGroupTopN(0);
    gameBroadcast("peek_at", {group_id: group.id, stack_indices: [], card_indices: [], player_n: playerN, reset_peek: true})
  }

  const handleSelectClick = (event) => {
    const topNstr = event.target.value;
    handleBrowseTopN(
      topNstr, 
      group,
      playerN,
      gameBroadcast, 
      chatBroadcast,
      setBrowseGroupId,
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
    // setBrowseGroupId(group.id);
    // setBrowseGroupTopN(topN);
    // gameBroadcast("peek_at", {group_id: group.id, stack_indices: peekStackIndices, card_indices: peekCardIndices, player_n: 'Player1', reset_peek: true})
  }

  const handleInputTyping = (event) => {
    setSelectedCardName(event.target.value);
    //setSelectedCardType(event.target.value);
  }

  // If browseGroupTopN not set, or equal to "All" or "None", show all stacks
  var browseGroupTopNint = isNormalInteger(browseGroupTopN) ? parseInt(browseGroupTopN) : numStacks;
  var filteredStackIndices = [...Array(browseGroupTopNint).keys()];
  // Filter by selected card type
  if (selectedCardType != "All") 
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stacks[s] && 
      stacks[s]["cards"][0]["sides"]["A"]["type"] === selectedCardType &&
      stacks[s]["cards"][0]["peeking"][playerN]
    ));
  // Filter by card name
  if (selectedCardName != "")
    filteredStackIndices = filteredStackIndices.filter((s,i) => (
      stacks[s] && 
      stacks[s]["cards"][0]["sides"]["A"]["name"].toLowerCase().includes(selectedCardName.toLowerCase()) &&
      stacks[s]["cards"][0]["peeking"][playerN]
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
      <div style={{width:"100%", height:"20px", float:"left"}}>
      <ContextMenuTrigger id={group.id} holdToDisplay={0}>
        <Header className="float-left">
            <Title>Browsing: {GROUPSINFO[group.id].name} <FontAwesomeIcon className="text-white" icon={faChevronDown}/></Title>
        </Header>
      </ContextMenuTrigger> 

      <FontAwesomeIcon className="text-white float-right mr-2 mt-1" icon={faTimes} onClick={handleCloseClick}/>
      </div>
      <GroupContextMenu
        group={group}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        playerN={playerN}
        setBrowseGroupId={setBrowseGroupId}
        setBrowseGroupTopN={setBrowseGroupTopN}
      ></GroupContextMenu>

    {/* <div style={{height:"100%", width:"100%"}}> */}
      <div style={{width:"75%", height:"100%", float:"left"}}>
        <Stacks
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
          playerN={playerN}
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
                <input style={{width:"50%"}} type="text" id="name" name="name" className="ml-5" placeholder="Card name..." onChange={handleInputTyping}></input>
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

export default class BrowseContainer extends Component {
  render() {
    if (this.props.group) {
      return (
        <WidthContainer style={{width: "100%"}}>
          <BrowseComponent
            group={this.props.group} 
            gameBroadcast={this.props.gameBroadcast} 
            chatBroadcast={this.props.chatBroadcast}
            browseGroupTopN={this.props.browseGroupTopN}
            setBrowseGroupId={this.props.setBrowseGroupId}
            setBrowseGroupTopN={this.props.setBrowseGroupTopN}
            playerN={this.props.playerN}
          ></BrowseComponent>
        </WidthContainer>
      )
    } else {
      return (<div></div>)
    }
  }
}