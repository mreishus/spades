import React, { useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { GROUPSINFO } from "./Constants";
import { handleDropdownClickCommon } from "./DropdownMenuClick";
import { DropdownMenuCard } from "./DropdownMenuCard";
import { DropdownMenuGroup } from "./DropdownMenuGroup";
import { getDisplayName, tokenTitleName, getVisibleSide } from "./Helpers";
import { faArrowUp, faArrowDown, faRandom, faReply, faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from 'react-redux';
import { calcHeightCommon, DropdownItem, GoBack } from "./DropdownMenuHelpers";
import "../../css/custom-dropdown.css";

export const DropdownMenuCommon = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
  mouseX,
  mouseY,
  dropdownMenu,
  setDropdownMenu,
  setIsHovering,
}) => {
  
  const gameStore = state => state?.gameUi?.game;
  const game = useSelector(gameStore);

  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);

  const menuCard = dropdownMenu.card;
  const menuCardIndex = dropdownMenu.cardIndex;

  const visibleSide = getVisibleSide(menuCard);
  const displayName = getDisplayName(menuCard);

  const calcHeight = (el) => {
    calcHeightCommon(el, setMenuHeight);
  }

  const handleDropdownClick = (props) => {
    if (props.goToMenu) {
      setActiveMenu(props.goToMenu);
      return;
    }
    handleDropdownClickCommon(dropdownMenu, props, playerN, game, gameBroadcast, chatBroadcast);
    setActiveMenu("main");
    setIsHovering(false);
    setDropdownMenu(null);
    setMenuHeight(null);
  }

  if (dropdownMenu.type === "card") {
    return (
      <DropdownMenuCard
        playerN={playerN}
        mouseX={mouseX}
        mouseY={mouseY}
        menuHeight={menuHeight}
        dropdownMenu={dropdownMenu}
        handleDropdownClick={handleDropdownClick}
        calcHeight={calcHeight}
        activeMenu={activeMenu}
        setIsHovering={setIsHovering}
      />
    )
  } else if (dropdownMenu.type === "group") {
    return (
      <DropdownMenuGroup
        playerN={playerN}
        mouseX={mouseX}
        mouseY={mouseY}
        menuHeight={menuHeight}
        dropdownMenu={dropdownMenu}
        handleDropdownClick={handleDropdownClick}
        calcHeight={calcHeight}
        activeMenu={activeMenu}
        setIsHovering={setIsHovering}
      />
    )
  } else return null;

})