import React, { Component } from "react";
import { useSelector, useDispatch } from 'react-redux';
import styled from "@emotion/styled";
import { Stacks } from "./Stacks";
import Title from "./Title";
import { GROUPSINFO } from "./Constants";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import { handleBrowseTopN } from "./HandleBrowseTopN";
import { GroupContextMenu } from "./GroupContextMenu";

const Container = styled.div`
  max-height: 100%;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  float: left;
  align-items: center;
  justify-content: center;
  color: white;
  width: 15px;
  writing-mode: vertical-rl;
  text-align: center;
  align-items: center;
  position: absolute;
  justify-content: center;
  display: flex;
`;

const WidthContainer = styled.div`
  padding: 2px 2px 2px 0.5vw;
  float: left;
  height: 100%;
`;

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
  console.log("rendering group ",groupId);
  const storeGroup = state => state?.gameUi?.game?.groupById?.[groupId];
  const group = useSelector(storeGroup);
  if (!group) return null;
  const numStacks = group.stackIds.length;
  const beingBrowsed = browseGroupId === groupId;
  return(
    <div className="h-full w-full">
      {hideTitle ? null :
        <div
          className="relative text-center h-full text-white float-left select-none opacity-40"
          style={{width:"15px", writingMode:"vertical-rl"}} 
        >
          <ContextMenuTrigger id={group.id} holdToDisplay={0}>
          {/* <div className={"rounded"+ (group.type == "play" ? "" : "hover:bg-gray-500")}> */}
            <div>
              {group.type == "play" ? "" : <FontAwesomeIcon className="text-white mb-2 pl-1" icon={faBars}/>}
              {GROUPSINFO[group.id].tablename}
            </div>
          </ContextMenuTrigger>
        </div>
      }
      <GroupContextMenu
        group={group}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        playerN={playerN}
        setBrowseGroupId={setBrowseGroupId}
        setBrowseGroupTopN={setBrowseGroupTopN}
      />
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