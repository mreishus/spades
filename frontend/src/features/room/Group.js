import React from "react";
import { useSelector } from 'react-redux';
import { Stacks } from "./Stacks";
import { GROUPSINFO } from "./Constants";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenuTrigger } from "react-contextmenu";
import { GroupContextMenu } from "./GroupContextMenu";
import { useSetDropdownMenu } from "../../contexts/DropdownMenuContext";
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
  
  const onLongPress = () => {
    console.log(group);
  };

  const onClick = () => {
    console.log('longpress is triggered');
    const dropdownMenu = {
        type: "group",
        group: group,
        title: GROUPSINFO[groupId].name,
        setBrowseGroupId: setBrowseGroupId,
        setBrowseGroupTopN: setBrowseGroupTopN,
    }
    setDropdownMenu(dropdownMenu);
  }

  const defaultOptions = {
      shouldPreventDefault: true,
      delay: 500,
  };

  const longPress = useLongPress(onLongPress, onClick, defaultOptions);

  if (!group) return null;
  const numStacks = group.stackIds.length;
  return(
    <div className="h-full w-full">
      {hideTitle ? null :
        <div
          className="relative text-center h-full text-white float-left select-none opacity-40"
          style={{width:"15px", writingMode:"vertical-rl"}} 
        >
          {/* <ContextMenuTrigger id={group.id} holdToDisplay={0}> */}
          {group.type === "play" ? 
            <div>
              {GROUPSINFO[group.id].tablename}
            </div>
          :
            <div {...longPress}>
              <FontAwesomeIcon className="text-white mb-2 pl-1" icon={faBars}/>
              {GROUPSINFO[group.id].tablename}
            </div>
          }
            
          {/* </ContextMenuTrigger> */}
        </div>
      }
      {/* <GroupContextMenu
        group={group}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        playerN={playerN}
        setBrowseGroupId={setBrowseGroupId}
        setBrowseGroupTopN={setBrowseGroupTopN}
      /> */}
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