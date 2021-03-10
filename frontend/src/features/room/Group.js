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
  padding: 1px 1px 1px 1px;
  max-height: 100%;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  align-items: center;
  justify-content: center;
  color: white;
  height: 13%;
`;

const WidthContainer = styled.div`
  padding: 2px 2px 2px 0.5vw;
  float: left;
  height: 100%;
`;

export const Group = React.memo(({
  groupId,
  width,
  gameBroadcast,
  chatBroadcast,
  playerN,
  showTitle,
  setBrowseGroupId,
  setBrowseGroupTopN,
}) => {
  console.log("rendering group ",groupId);
  const storeGroup = state => state?.gameUi?.game?.groupById[groupId];
  const group = useSelector(storeGroup);
  if (!group) return null;
  console.log("rendering group ",group);
  const numStacks = group.stackIds.length;
  return(
    <WidthContainer 
      style={{
        width: width, 
        // visibility: beingBrowsed ? "hidden" : "visible"
      }}>
      {/* {beingBrowsed? <div></div> : */}
        <div style={{width:"100%", height:"100%"}}>
          <Container>
            <ContextMenuTrigger id={group.id} holdToDisplay={0}>
              <Header>
                <Title>{GROUPSINFO[group.id].tablename} <FontAwesomeIcon className="text-white" icon={faChevronDown}/></Title>
              </Header>
            </ContextMenuTrigger>

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
              isCombineEnabled={group.type === "play"}
              selectedStackIndices={[...Array(numStacks).keys()]}
            ></Stacks>
          </Container>
        </div>
      }
    )
    </WidthContainer>
  )
})