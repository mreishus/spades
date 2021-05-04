import React, {useState} from "react";
import { useSelector } from 'react-redux';
import { useKeypress, useSetKeypress} from "../../contexts/KeypressContext";
import { HandleKeyDown } from "./HandleKeyDown";
import { GetPlayerN } from "./Helpers";
import { DragContainer } from "./DragContainer";
import useProfile from "../../hooks/useProfile";

const RoomGame = React.memo(({ gameBroadcast, chatBroadcast }) => {
  console.log('Rendering RoomGame');
  const storePlayerIds = state => state?.gameUi?.playerIds;
  const playerIds = useSelector(storePlayerIds);
  const [typing, setTyping] = useState(false);
  const keypress = useKeypress();
  const setKeypress = useSetKeypress();
  const myUser = useProfile();
  const myUserID = myUser?.id;
  if (!playerIds) return null;
  
  const playerN = GetPlayerN(playerIds, myUserID);
  return (
    <div className="h-full w-full">
      <HandleKeyDown
        playerN={playerN}
        typing={typing}
        keypress={keypress}
        setKeypress={setKeypress}
        gameBroadcast={gameBroadcast} 
        chatBroadcast={chatBroadcast}
      />
      <DragContainer 
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        setTyping={setTyping}
      />
    </div>
  )
})

export default RoomGame;
