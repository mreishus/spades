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
          style={{width:"15px", writingMode:"vertical-rl"}} 
        >
          {group.type === "play" ? 
            <div>
              {GROUPSINFO[group.id].tablename}
            </div>
          :
            <div className="w-full h-full">
              <FontAwesomeIcon onClick={handleEyeClick}  className="hover:text-white mb-2 pl-1" icon={faEye}/>
              <FontAwesomeIcon onClick={handleBarsClick}  className="hover:text-white mb-2 pl-1" icon={faBars}/>
              <span className="mt-1">{GROUPSINFO[group.id].tablename}</span>
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
        stackIds={group.stackIds}
        cardSize={cardSize}
        isCombineEnabled={group.type === "play"}
        selectedStackIndices={[...Array(numStacks).keys()]}
        registerDivToArrowsContext={registerDivToArrowsContext}
      />
    </div>
  )
})