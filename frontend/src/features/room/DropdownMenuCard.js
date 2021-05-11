import React, { useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { GROUPSINFO } from "./Constants";
import { getDisplayName, tokenTitleName, getVisibleSide } from "./Helpers";
import { faArrowUp, faArrowDown, faRandom, faReply, faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownItem, GoBack } from "./DropdownMenuCommon"

import "../../css/custom-dropdown.css";

export const DropdownMenuCard = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
  top,
  left,
  dropdownMenu,
  setDropdownMenu,
  setIsHovering,
}) => {
  
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);

  const menuCard = dropdownMenu.card;
  const menuCardIndex = dropdownMenu.cardIndex;

  const visibleSide = getVisibleSide(menuCard);
  const displayName = getDisplayName(menuCard);

  function calcHeight(el) {
    const height = el.clientHeight+50;
    setMenuHeight(height);
  }

  const handleDropdownClick = (props) => {
    if (props.goToMenu) {
      console.log("Going to ", props.goToMenu);
      setActiveMenu(props.goToMenu);
      return;
    } 
    if (!menuCard) return;

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
        chatBroadcast("game_update",{message: "added "+increment+" "+tokenType+" per round to "+displayName+"."})
    }
    setActiveMenu("main");
    setIsHovering(false);
    setDropdownMenu(null);
    setMenuHeight(null);
  }


  function DropdownMoveTo(props) {
    return (
      <div className="menu">
        <GoBack goToMenu="moveTo" clickCallback={handleDropdownClick}/>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowUp}/>}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="top"
          clickCallback={handleDropdownClick}>
          Top
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faRandom}/>}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="shuffle"
          clickCallback={handleDropdownClick}>
          Shuffle in
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowDown}/>}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="bottom"
          clickCallback={handleDropdownClick}>
          Bottom
        </DropdownItem>
      </div>
    )
  }

  // const DropdownTransition = (props) => {

  // }
  // function DropdownItem(props) {
  //   return (
  //     <a href="#" className="menu-item" onMouseDown={() => props.clickCallback(props)}>    
  //       {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
  //       {props.children}
  //       <span className="icon-right">{props.rightIcon}</span>
  //     </a>
  //   );
  // }

  return (
    <div 
      className="dropdown" 
      style={{ height: menuHeight, zIndex: 1e7, top: top, left: left }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      >
        <div className="menu-title">{displayName}</div>

        <CSSTransition
          onEnter={calcHeight}
          in={activeMenu === 'main'}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit>

        <div className="menu">
          {menuCardIndex>0 ? <DropdownItem action="detach">Detach</DropdownItem> : null}
          {(visibleSide === "B" && !menuCard?.peeking[playerN]) ? <DropdownItem action="peek">Peek</DropdownItem> : null}
          {menuCard?.peeking[playerN] ? <DropdownItem action="unpeek">Stop peeking</DropdownItem> : null}
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="moveTo"
            clickCallback={handleDropdownClick}>
            Move to
          </DropdownItem>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="perRound"
            clickCallback={handleDropdownClick}>
            Per round
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        onEnter={calcHeight}
        in={activeMenu === 'moveTo'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit>
        <div className="menu">
          <GoBack goToMenu="main" clickCallback={handleDropdownClick}/>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="moveToEncounter"
            clickCallback={handleDropdownClick}>
            Encounter Deck
          </DropdownItem>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="moveToOwner"
            clickCallback={handleDropdownClick}>
            Owner's Deck
          </DropdownItem>
          <DropdownItem
            action="moveCard"
            destGroupId="sharedVictory"
            position="top"
            clickCallback={handleDropdownClick}>
            Victory Display
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        onEnter={calcHeight}
        in={activeMenu === 'moveToEncounter'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit>
        <DropdownMoveTo destGroupId="sharedEncounterDeck"/>
      </CSSTransition>

      <CSSTransition
        onEnter={calcHeight}
        in={activeMenu === 'moveToOwner'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit>
        <DropdownMoveTo destGroupId={playerN+"Deck"}/>
      </CSSTransition>

      <CSSTransition
        onEnter={calcHeight}
        in={activeMenu === 'perRound'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit>
        <div className="menu">
          <GoBack goToMenu="main" clickCallback={handleDropdownClick}/>
          {["resource", "progress", "damage"].map((tokenType, _tokenIndex) => (
            <DropdownItem
              rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
              goToMenu={tokenType+"PerRound"}
              tokenType={tokenType}
              clickCallback={handleDropdownClick}>
              {tokenTitleName(tokenType)}
            </DropdownItem>
          ))}
        </div>
      </CSSTransition>

      {["resource", "progress", "damage"].map((tokenType, _tokenIndex) => (
        <CSSTransition
          onEnter={calcHeight}
          in={activeMenu === tokenType+"PerRound"}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit>
          <div className="menu">
            <GoBack goToMenu="perRound" clickCallback={handleDropdownClick}/>
            {[-3,-2,-1,0,1,2,3].map((increment, _tokenIndex) => (
              <DropdownItem
                rightIcon={menuCard.tokensPerRound[tokenType]===increment ? <FontAwesomeIcon icon={faCheck}/> : null}
                action={"incrementTokenPerRound"}
                tokenType={tokenType}
                increment={increment}
                clickCallback={handleDropdownClick}>
                {increment}
              </DropdownItem>
            ))}
          </div>
        </CSSTransition>
      ))}
    </div>
  );
})