import React from "react";
import { useSelector } from 'react-redux';
import { GROUPSINFO } from "./Constants";

export const TopBarView = React.memo(({
  setShowHotkeys,
  setShowPlayersInRoom,
  handleBrowseSelect,
  playerN,
}) => {
  const groupByIdStore = state => state.gameUi.game.groupById;
  const groupById = useSelector(groupByIdStore);
  const numPlayersStore = state => state.gameUi.game.numPlayers;
  const numPlayers = useSelector(numPlayersStore);

  const handleMenuClick = (data) => {
    if (!playerN) {
      alert("Please sit at the table first.");
      return;
    } else if (data.action === "look_at") {
      handleBrowseSelect(data.groupId);
    } 
  }

  const range = (size, startAt = 0) => {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  if (!groupById) return;

  return(
    <li>
      <div className="h-full flex text-xl items-center justify-center" href="#">View</div>
      <ul className="second-level-menu">
          <li key={"Hotkeys"}>
            <a href="#" onClick={() => setShowHotkeys(true)}>Hotkeys</a>
          </li>
          <li key={"PlayersInRoom"}>
            <a href="#" onClick={() => setShowPlayersInRoom(true)}>Players in Room</a>
          </li>
          <li key={"Shared"}>
            <a href="#">Shared</a>
              <ul className="third-level-menu">
                {Object.keys(GROUPSINFO).map((groupId, _index) => {
                  console.log("ABC", groupById, groupId);
                  if (!groupById[groupId]) return;
                  const stackIds = groupById[groupId].stackIds;
                  const deckType = groupById[groupId].type;
                  if (deckType !== "play" && groupId.startsWith("shared"))
                    return(
                      <li className="relative cursor-pointer" onClick={() => handleMenuClick({action:"look_at",groupId:groupId})} key={groupId}>
                        <a className="absolute" href="#">
                          {GROUPSINFO[groupId].name}
                        </a>
                        <div className="absolute right-2 top-1 select-none">{stackIds.length}</div>
                      </li>) 
                  else return null;
                })}
            </ul>
          </li>
          {range(numPlayers, 1).map((N, _playerIndex) => (
          <li key={"player"+N}>
            <a href="#">Player {N}</a>
              <ul className="third-level-menu">
                {Object.keys(GROUPSINFO).map((groupId, _index) => {
                  if (!groupById[groupId]) return;
                  const stackIds = groupById[groupId].stackIds;
                  const deckType = groupById[groupId].type;
                  if (deckType !== "play" && groupId.startsWith("player"+N))
                    return(
                      <li className="relative cursor-pointer" key={groupId}>
                        <a className="absolute" onClick={() => handleMenuClick({action:"look_at",groupId:groupId})} href="#">
                          {GROUPSINFO[groupId].name}
                        </a>
                        <div className="absolute right-2 top-1 select-none">{stackIds.length}</div>
                      </li>) 
                  else return null;
                })}
            </ul>
          </li>
          ))}
      </ul>
    </li>
  )
})