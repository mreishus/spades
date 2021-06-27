import React from "react";
import { useSelector } from 'react-redux';
import { Stacks } from "./Stacks";
import { GROUPSINFO } from "./Constants";
import { faBars, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenuTrigger } from "react-contextmenu";
import { GroupContextMenu } from "./GroupContextMenu";
import { useSetDropdownMenu } from "../../contexts/DropdownMenuContext";
import { handleBrowseTopN } from "./HandleBrowseTopN"; 
import useLongPress from "../../hooks/useLongPress";

export const Group = React.memo(({
  groupId,
  cardSize,
  gameBroadcast,
  chatBroadcast,
  playerN,
  hideTitle,
  browseGroupId,
  setBrowseGroupId,
  setBrowseGroupTopN,
  registerDivToArrowsContext
}) => {
  console.log("Rendering Group ",groupId);
  const storeGroup = state => state?.gameUi?.game?.groupById?.[groupId];
  const group = useSelector(storeGroup);
  const setDropdownMenu = useSetDropdownMenu();

  const handleEyeClick = () => {
    handleBrowseTopN("All", group, playerN, gameBroadcast, chatBroadcast, setBrowseGroupId, setBrowseGroupTopN);
  }

  const handleBarsClick = () => {
    if (!playerN) return;
    const dropdownMenu = {
        type: "group",
        group: group,
        title: GROUPSINFO[groupId].name,
        setBrowseGroupId: setBrowseGroupId,
        setBrowseGroupTopN: setBrowseGroupTopN,
    }
    if (playerN) setDropdownMenu(dropdownMenu);
  }

  if (!group) return null;
  const numStacks = group.stackIds.length;
  return(
    <div className="h-full w-full">
      {hideTitle ? null :
        <div
          className="relative text-center h-full float-left select-none text-gray-500"
          style={{width:"15px"}} 
        >
          {group.type === "play" ?        
            <div className="absolute whitespace-nowrap pointer-events-none mt-1 text-sm" 
            style={{top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(90deg)"}}>
              {GROUPSINFO[group.id].tablename}
            </div>
          :
            <div className="w-full h-full">
              <FontAwesomeIcon onClick={handleEyeClick}  className="hover:text-white mt-2" icon={faEye}/>
              <FontAwesomeIcon onClick={handleBarsClick}  className="hover:text-white" icon={faBars}/>
              <span 
                className="absolute whitespace-nowrap pointer-events-none mt-1 text-sm" 
                style={{top: "50%", left: "50%", transform: `translate(-50%, ${group.id === "sharedEncounterDeck" ? "80%" : "0%"}) rotate(90deg)`}}>
                  {GROUPSINFO[group.id].tablename + (group.type === "deck" ? " ("+numStacks+")" : "")}
              </span>
            </div>
          }
        </div>
      }
      <Stacks
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        playerN={playerN}
        groupId={group.id}
        groupType={group.type}
        cardSize={cardSize}
        selectedStackIndices={[...Array(numStacks).keys()]}
        registerDivToArrowsContext={registerDivToArrowsContext}
      />
    </div>
  )
})