import React from "react";
import { useSelector } from 'react-redux';
import { GROUPSINFO } from "./Constants";
import { TopBarViewItem } from "./TopBarViewItem";

export const TopBarView = React.memo(({
  setShowHotkeys,
  setShowPlayersInRoom,
  handleBrowseSelect,
  playerN,
}) => {
  const numPlayersStore = state => state.gameUi.game.numPlayers;
  const numPlayers = useSelector(numPlayersStore);

  const range = (size, startAt = 0) => {
    return [...Array(size).keys()].map(i => i + startAt);
  }

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
                  if (groupId.startsWith("shared")) return (
                    <TopBarViewItem groupId={groupId} handleBrowseSelect={handleBrowseSelect} playerN={playerN}/>
                  )
                })}
            </ul>
          </li>
          {range(numPlayers, 1).map((N, _playerIndex) => (
          <li key={"player"+N}>
            <a href="#">Player {N}</a>
              <ul className="third-level-menu">
                {Object.keys(GROUPSINFO).map((groupId, _index) => {
                  if (groupId.startsWith("player"+N)) return (
                    <TopBarViewItem groupId={groupId} handleBrowseSelect={handleBrowseSelect} playerN={playerN}/>
                  )
                })}
            </ul>
          </li>
          ))}
      </ul>
    </li>
  )
})