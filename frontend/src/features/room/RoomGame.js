import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useKeypress, useSetKeypress} from "../../contexts/KeypressContext";
import { HandleKeyDown } from "./HandleKeyDown";
import { DragContainer } from "./DragContainer";
import { HandleTouchButtonGame } from "./HandleTouchButtonGame";

const RoomGame = React.memo(({ playerN, gameBroadcast, chatBroadcast }) => {
  console.log('Rendering RoomGame');
  const [typing, setTyping] = useState(false);
  const keypress = useKeypress();
  const setKeypress = useSetKeypress();

  useEffect(() => {
    const onKeyUp = (event) => {
      if (event.key === "Shift") setKeypress({"Shift": false});
      if (event.key === " ") setKeypress({"Space": false});
      if (event.key === "Control") setKeypress({"Control": false});
      if (event.key === "Tab") setKeypress({"Tab": false});
    }

    document.addEventListener('keyup', onKeyUp);

    return () => {
        document.removeEventListener('keyup', onKeyUp);
    }
  }, []);

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
      <HandleTouchButtonGame
        playerN={playerN}
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
