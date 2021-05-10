import React, { useState, useEffect } from "react";
import { TableLayout } from "./TableLayout";
import { GiantCard } from "./GiantCard";
import { TopBar } from "./TopBar";
import { SpawnCardModal } from "./SpawnCardModal";
import { SideBar } from "./SideBar";
import { Hotkeys } from "./Hotkeys";
import { DropdownMenuCard } from "./DropDownMenuCard";
import { CSSTransition } from 'react-transition-group';
import { GROUPSINFO } from "./Constants";
import { getDisplayName, tokenTitleName, getVisibleFace, getVisibleFaceSRC, getVisibleSide } from "./Helpers";
import { faArrowUp, faArrowDown, faRandom, faReply, faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../../css/custom-dropdown.css";

import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";

function NavItem(props) {
    const [open, setOpen] = useState(false);

    const handleClick = (event) => {
      event.stopPropagation();
      setOpen(!open);
    }

    return (
        <li className="nav-item">
        <a href="#" className="icon-button" onClick={handleClick}>
            F{/* {props.icon} */}
        </a>

        {open && props.children}
        </li>
    );
}

const DropdownMenu = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  
  const activeCardAndLoc = useActiveCard();
  const [menuCardAndLoc, setMenuCardAndLoc] = useState(null);
  const setActiveCard = useSetActiveCard();
  const menuCard = menuCardAndLoc?.card;
  const visibleSide = getVisibleSide(menuCard);
  const displayName = getDisplayName(menuCard);

  useEffect(() => {

    const handleClick = (event) => {
      if (isHovering) return;
      else if (activeCardAndLoc) {
        const leftSide = event.clientX < (window.innerWidth/2)
        const topSide = event.clientY < (window.innerHeight/2)
        setLeft(event.clientX + (leftSide ? 0 : -300));    
        setTop(event.clientY + (topSide ? 0 : -50));
        setIsOpen(true);
        setMenuCardAndLoc(activeCardAndLoc);
        setActiveCard(null);
      } else if (isOpen) {
        setActiveMenu("main");
        setIsOpen(false);
        setMenuCardAndLoc(null);
      } 
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [activeCardAndLoc, isOpen, isHovering])

  function calcHeight(el) {
    const height = el.clientHeight+20;
    setMenuHeight(height);
  }

  const handleDropdownClick = (props) => {
    console.log(props);
    console.log(menuCardAndLoc);
    if (props.goToMenu) {
      setActiveMenu(props.goToMenu);
      return;
    } 
    if (!menuCardAndLoc) return;

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
    setIsOpen(false);
    setIsHovering(false);
    setMenuCardAndLoc(null);
    setMenuHeight(null);
  }

  function GoBack(props) {
    return (
      <DropdownItem goToMenu={props.goToMenu} leftIcon={<FontAwesomeIcon icon={faReply}/>}>
        Go back
      </DropdownItem>
    )
  }

  function DropdownMoveTo(props) {
    return (
      <div className="menu">
        <GoBack goToMenu="moveTo"/>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowUp}/>}
          rightIcon={""}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="top">
          Top
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faRandom}/>}
          rightIcon={""}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="shuffle">
          Shuffle in
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowDown}/>}
          rightIcon={""}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="bottom">
          Bottom
        </DropdownItem>
      </div>
    )
  }

  function DropdownIncrement(props) {
    return (
      <div className="menu">
        <GoBack goToMenu="moveTo"/>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowUp}/>}
          rightIcon={""}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="top">
          Top
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faRandom}/>}
          rightIcon={""}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="shuffle">
          Shuffle in
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowDown}/>}
          rightIcon={""}
          action="moveCard"
          destGroupId={props.destGroupId}
          position="bottom">
          Bottom
        </DropdownItem>
      </div>
    )
  }

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={() => handleDropdownClick(props)}>    
        {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  if (!isOpen) return null;
  if (!menuCard) return null;
  return (
    <div 
      className="dropdown" 
      style={{ height: menuHeight, zIndex: 1e7, top: top, left: left }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      >

        <CSSTransition
          onEnter={calcHeight}
          in={activeMenu === 'main'}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit>

        <div className="menu">
          {menuCard?.cardIndex>0 ? <DropdownItem action="detach">Detach</DropdownItem> : null}
          {(visibleSide === "B" && !menuCard?.peeking[playerN]) ? <DropdownItem action="peek">Peek</DropdownItem> : null}
          {menuCard?.peeking[playerN] ? <DropdownItem action="unpeek">Stop peeking</DropdownItem> : null}
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="moveTo">
            Move to
          </DropdownItem>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="perRound">
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
          <GoBack goToMenu="main"/>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="moveToEncounter">
            Encounter Deck
          </DropdownItem>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="moveToOwner">
            Owner's Deck
          </DropdownItem>
          <DropdownItem
            action="moveCard"
            destGroupId="sharedVictory"
            position="top">
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
        <DropdownMoveTo destGroupId="sharedEncounter"/>
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
          <GoBack goToMenu="main"/>
          {["resource", "progress", "damage"].map((tokenType, _tokenIndex) => (
            <DropdownItem
              rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
              goToMenu={tokenType+"PerRound"}
              tokenType={tokenType}>
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
            <GoBack goToMenu="perRound"/>
            {[-3,-2,-1,0,1,2,3].map((increment, _tokenIndex) => (
              <DropdownItem
                rightIcon={menuCard.tokensPerRound[tokenType]===increment ? <FontAwesomeIcon icon={faCheck}/> : null}
                action={"incrementTokenPerRound"}
                tokenType={tokenType}
                increment={increment}>
                {increment}
              </DropdownItem>
            ))}
          </div>
        </CSSTransition>
      ))}
    </div>
  );
})
export const Table = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
  setTyping,
  registerDivToArrowsContext
}) => {
  console.log('Rendering Table');
  const [showSpawn, setShowSpawn] = useState(false);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [sittingPlayerN, setSittingPlayerN] = useState("");
  // Show/hide group that allows you to browse certain cards in a group
  const [browseGroupId, setBrowseGroupId] = useState("");
  // Indices of stacks in group being browsed
  const [browseGroupTopN, setBrowseGroupTopN] = useState(0);
  const [observingPlayerN, setObservingPlayerN] = useState(playerN);

  const handleBrowseSelect = (groupId) => {
    setBrowseGroupId(groupId);
    setBrowseGroupTopN("All");
  }

  return (
    <div className="h-full flex">
      <DropdownMenuCard
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
      />

      {showHotkeys && <Hotkeys setShowHotkeys={setShowHotkeys}/>}
      {/* Side panel */}
      <SideBar
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
      />
      {/* Main panel */}
      <div className="flex w-full">
        <div className="flex flex-col w-full h-full">
          {/* Game menu bar */}
          <div className="bg-gray-600 text-white" style={{height: "6%"}}>
            <TopBar
              setShowSpawn={setShowSpawn}
              setShowHotkeys={setShowHotkeys}
              handleBrowseSelect={handleBrowseSelect}
              gameBroadcast={gameBroadcast}
              chatBroadcast={chatBroadcast}
              playerN={playerN}
              sittingPlayerN={sittingPlayerN}
              setSittingPlayerN={setSittingPlayerN}
              observingPlayerN={observingPlayerN}
              setObservingPlayerN={setObservingPlayerN}
            />
          </div>
          {/* Table */}
          <div className="" style={{height: "94%"}}>
            <TableLayout
              observingPlayerN={observingPlayerN}
              gameBroadcast={gameBroadcast} 
              chatBroadcast={chatBroadcast}
              playerN={playerN}
              setTyping={setTyping}
              browseGroupId={browseGroupId}
              setBrowseGroupId={setBrowseGroupId}
              browseGroupTopN={browseGroupTopN}
              setBrowseGroupTopN={setBrowseGroupTopN}
              registerDivToArrowsContext={registerDivToArrowsContext}
            />
          </div>
        </div>
      </div>
      {/* Card hover view */}
      <GiantCard playerN={playerN}/>
      {showSpawn && 
        <SpawnCardModal 
          setShowSpawn={setShowSpawn}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
        />
      }
    </div>
  );
})







