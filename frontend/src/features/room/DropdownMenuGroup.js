import React from "react";
import { CSSTransition } from 'react-transition-group';
import { tokenTitleName, getVisibleSide } from "./Helpers";
import { faArrowUp, faArrowDown, faRandom, faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownItem, GoBack } from "./DropdownMenuHelpers";
import "../../css/custom-dropdown.css";

export const DropdownMenuCard = React.memo(({
  playerN,
  top,
  left,
  menuHeight,
  dropdownMenu,
  handleDropdownClick,
  calcHeight,
  activeMenu,
  setIsHovering,
}) => {
  const menuCard = dropdownMenu.card;
  const menuCardIndex = dropdownMenu.cardIndex;
  const visibleSide = getVisibleSide(menuCard);
  
  const DropdownMoveTo = (props) => {
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

  return (
    <div 
      className="dropdown" 
      style={{ height: menuHeight, zIndex: 1e7, top: top, left: left }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      >
        <div className="menu-title">{dropdownMenu.title}</div>

        <CSSTransition onEnter={calcHeight} timeout={500} classNames="menu-primary" unmountOnExit
          in={activeMenu === "main"}>
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

      <CSSTransition onEnter={calcHeight} timeout={500} classNames="menu-primary" unmountOnExit
          in={activeMenu === "moveTo"}>
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

      <CSSTransition onEnter={calcHeight} timeout={500} classNames="menu-primary" unmountOnExit
          in={activeMenu === "moveToEncounter"}>
        <DropdownMoveTo destGroupId="sharedEncounterDeck"/>
      </CSSTransition>

      <CSSTransition onEnter={calcHeight} timeout={500} classNames="menu-primary" unmountOnExit
          in={activeMenu === "moveToOwner"}>
        <DropdownMoveTo destGroupId={playerN+"Deck"}/>
      </CSSTransition>

      <CSSTransition onEnter={calcHeight} timeout={500} classNames="menu-primary" unmountOnExit
          in={activeMenu === "perRound"}>
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
        <CSSTransition onEnter={calcHeight} timeout={500} classNames="menu-primary" unmountOnExit
        in={activeMenu === tokenType+"PerRound"}>
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