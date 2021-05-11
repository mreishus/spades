import React, { useState, useEffect } from "react";
import { DropdownMenuCard } from "./DropdownMenuCard";
import { useMousePosition } from "../../contexts/MousePositionContext";
import { useDropdownMenu, useSetDropdownMenu } from "../../contexts/DropdownMenuContext";

import "../../css/custom-dropdown.css";

export const DropdownMenu = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
}) => {
  const mousePostion = useMousePosition();
  const dropdownMenu = useDropdownMenu();
  const setDropdownMenu = useSetDropdownMenu();
  
  const [isHovering, setIsHovering] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  console.log("Rendering DropdownMenuCard ", isHovering, playerN);

  useEffect(() => {

    const handleClick = (event) => {
      if (!isOpen) return;
      // Menu is open
      if (!isHovering || playerN === null) {
        setIsOpen(false);
        setDropdownMenu(null);
        return;
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    }
  }, [dropdownMenu, isHovering])

  if (!mousePostion) return null;
  if (!dropdownMenu) return null;

  if (!isOpen) {
    setLeft((mousePostion.x < (window.innerWidth/2))  ? mousePostion.x : mousePostion.x -300);
    setTop((mousePostion.y < (window.innerHeight/2)) ? mousePostion.y : mousePostion.y -50);
    setIsOpen(true);
  }

  if (dropdownMenu.type == "card") { 
    return (
      <DropdownMenuCard
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        top={top}
        left={left}
        dropdownMenu={dropdownMenu}
        setDropdownMenu={setDropdownMenu}
        setIsHovering={setIsHovering}
      />
  )} else return null;

})