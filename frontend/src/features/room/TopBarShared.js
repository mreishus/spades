import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import useFocus from "../../hooks/useFocus";
import { setValues } from "./gameUiSlice";

var delayBroadcast;

export const TopBarShared = React.memo(({
  playerN,
  threat,
  progress,
  gameBroadcast,
  chatBroadcast,
}) => {
  const dispatch = useDispatch();
  const roundStore = state => state?.gameUi?.game?.roundNumber
  const gameUiRound = useSelector(roundStore);
  const [roundValue, setRoundValue] = useState(gameUiRound);
  const [inputRefRound, setInputFocusRound] = useFocus();

  const handleRoundChange = (event) => {
    const newValue = event.target.value;
    setRoundValue(newValue);
    // Set up a delayed broadcast to update the game state that interrupts itself if the button is clicked again shortly after.
    if (delayBroadcast) clearTimeout(delayBroadcast);
    delayBroadcast = setTimeout(function() {
      const updates = [["game", "roundNumber", parseInt(newValue)]];
      dispatch(setValues({updates: updates}));
      gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
      chatBroadcast("game_update",{message: "set round number to "+newValue+"."});
      setInputFocusRound();
    }, 400);
  }

  return(
    <div className="float-left h-full bg-gray-600" style={{width: "16%"}}>
      <div className="float-left h-full w-1/3">
        <div className="h-1/2 w-full flex justify-center">
          Round
        </div>
        <div className="h-1/2 w-full flex justify-center">
          <img className="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/time.png'}></img>
          <input 
            className="h-full w-1/2 float-left text-center bg-transparent" 
            value={roundValue}
            onChange={handleRoundChange}
            type="number" min="0" step="1"
            disabled={playerN ? false : true}
            ref={inputRefRound}>
          </input>
        </div>
      </div>
      <div className="float-left h-full w-1/3">
        <div className="h-1/2 w-full flex justify-center">
          Staging
        </div>
        <div className="h-1/2 w-full flex justify-center">
          <div className="text-xl">{threat}</div>
          <img className="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/threat.png'}></img>
        </div>
      </div>
      <div className="float-left h-full w-1/3">
        <div className="h-1/2 w-full flex justify-center">
          Progress
        </div>
        <div className="h-1/2 w-full flex justify-center">
          <div className="text-xl">{progress}</div>
          <img className="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/progress.png'}></img>
        </div>
      </div>
    </div>
  )
})