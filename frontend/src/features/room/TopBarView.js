import React from "react";
import { useSelector } from 'react-redux';
import { GROUPSINFO } from "./Constants";
import { TopBarViewItem } from "./TopBarViewItem";


const keyClass = "m-auto border bg-gray-500 text-center bottom inline-block text-xs ml-2 mb-1";
const keyStyleL = {width: "35px", height: "20px", borderRadius: "5px"}

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
        <ul className="second-level-menu text-xs xl:text-base">
          <li key={"Hotkeys"}>
            <a href="#" onClick={() => setShowHotkeys(true)}>Hotkeys <div className={keyClass} style={keyStyleL}>Tab</div></a>
          </li>
          <li key={"PlayersInRoom"}>
            <a href="#" onClick={() => setShowPlayersInRoom(true)}>Spectators</a>
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