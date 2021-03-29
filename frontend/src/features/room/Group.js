import React, { Component } from "react";
import { useSelector, useDispatch } from 'react-redux';
import styled from "@emotion/styled";
import { Stacks } from "./Stacks";
import Title from "./Title";
import { GROUPSINFO } from "./Constants";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
  showTitle,
  browseGroupId,
  setBrowseGroupId,
  setBrowseGroupTopN,
}) => {
  console.log("rendering group ",groupId);
  const storeGroup = state => state?.gameUi?.game?.groupById?.[groupId];
  const group = useSelector(storeGroup);
  if (!group) return null;
  const numStacks = group.stackIds.length;
  const beingBrowsed = browseGroupId === groupId;
  return(
    <div className="h-full w-full">
        {/* {group.type === "play" && group.controller !== "shared" ? null : */}
          
            {/* <Header> */}
              {/* <Title> */}
                <div
                  className="relative text-center h-full text-white float-left"
                  style={{width:"15px", writingMode:"vertical-rl"}} 
                >
                  <ContextMenuTrigger id={group.id} holdToDisplay={0}>
                  {GROUPSINFO[group.id].tablename}
                  </ContextMenuTrigger>
                </div>
                
                {/* <FontAwesomeIcon className="text-white" icon={faChevronDown}/> */}
              {/* </Title> */}
            {/* </Header> */}
        {/* } */}
        <GroupContextMenu
          group={group}
          gameBroadcast={gameBroadcast}
          chatBroadcast={chatBroadcast}
          playerN={playerN}
          setBrowseGroupId={setBrowseGroupId}
          setBrowseGroupTopN={setBrowseGroupTopN}
        ></GroupContextMenu>
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
        />
    </div>
  )
})