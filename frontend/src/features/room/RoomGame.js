import React, {useState} from "react";
import { useSelector } from 'react-redux';
import { useKeypress, useSetKeypress} from "../../contexts/KeypressContext";
import { HandleKeyDown } from "./HandleKeyDown";
import { DragContainer } from "./DragContainer";

const RoomGame = React.memo(({ playerN, gameBroadcast, chatBroadcast }) => {
  console.log('Rendering RoomGame');
  const [typing, setTyping] = useState(false);
  const keypress = useKeypress();
  const setKeypress = useSetKeypress();
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
