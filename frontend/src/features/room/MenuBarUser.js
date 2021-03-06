import React, { useState, useEffect } from "react";
import UserName from "../user/UserName";
import useProfile from "../../hooks/useProfile";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import { Link } from "react-router-dom";

var delayBroadcast;

export const MenuBarUser = React.memo(({
  gameUI,
  playerN,
  playerIndex,
  gameBroadcast,
  chatBroadcast,
  observingPlayerN,
  setObservingPlayerN,
}) => {
  const isLoggedIn = useIsLoggedIn();
  const myUser = useProfile();
  const myUserID = myUser?.id;
  const sittingUserID = gameUI["playerIds"][playerN];
  console.log('rendering '+playerN);
  const gameUIThreat = gameUI["game"]["playerById"][playerN]["threat"];

  const [threatValue, setThreatValue] = useState(gameUIThreat);
  useEffect(() => {    
    if (gameUIThreat !== threatValue) setThreatValue(gameUIThreat);
  }, [gameUIThreat]);

  const handleThreatChange = (event) => {
    const newValue = event.target.value;
    setThreatValue(newValue);
    const increment = newValue - gameUIThreat;
   // Set up a delayed broadcast to update the game state that interupts itself if the button is clicked again shortly after.
    if (delayBroadcast) clearTimeout(delayBroadcast);
    delayBroadcast = setTimeout(function() {
      gameBroadcast("increment_threat",{player_n: playerN, increment: increment});
      if (increment > 0) chatBroadcast("game_update",{message: "raises threat by "+increment+" ("+newValue+")."});
      if (increment < 0) chatBroadcast("game_update",{message: "reduces threat by "+(-increment)+" ("+newValue+")."});
    }, 800);
}

  const handleSitClick = (action) => {
    // Get up from any seats first
    Object.keys(gameUI["playerIds"]).forEach((playerI) => {
      const sittingUserIDi = gameUI["playerIds"][playerI];
      if (sittingUserIDi === myUserID) {
        gameBroadcast("get_up",{"PlayerN": playerI});
        chatBroadcast("game_update",{message: "got up from "+playerI+"'s seat."});
      }
    })
    // Sit in seat
    if (action === "sit") {
      gameBroadcast("sit",{"PlayerN": playerN});
      chatBroadcast("game_update",{message: "sat in "+playerN+"'s seat."});
      setObservingPlayerN(playerN);
    } 
  }

  const handleObserveClick = () => {
    if (observingPlayerN === playerN) {
      setObservingPlayerN(null);
      chatBroadcast("game_update",{message: "stopped observing "+playerN+"."});
    } else {
      setObservingPlayerN(playerN);
      chatBroadcast("game_update",{message: "started observing "+playerN+"."});
    }
  }

  const sitButton = () => {
    if (!isLoggedIn) {
      return(<Link to="/login" className="h-full w-1/2 float-left flex justify-center hover:bg-gray-500 text-white">Log In</Link>)
    } else if (sittingUserID) {
      if (sittingUserID === myUserID) {
        return(<div onClick={() => handleSitClick("get_up")} className={"h-full w-1/2 float-left flex justify-center bg-gray-500"}>Get up</div>)
      } else {
        return(<div className={"h-full w-1/2 float-left flex justify-center text-black"}>Occ</div>)
      }
    } else {
      return(<div onClick={() => handleSitClick("sit")} className={"h-full w-1/2 float-left flex justify-center hover:bg-gray-500"}>Sit</div>)
    }
  }
  
  return(
    <div className="float-left h-full" style={{width: "15%"}}>
      <div className="float-left h-full w-2/3">
        <div className="h-1/2 w-full flex justify-center">
          {/* Show First player token */}
          {(gameUI["game"]["first_player"] === playerN) ? 
            <img className="h-full mr-1 mb-1" src={process.env.PUBLIC_URL + '/images/tokens/firstplayer.png'}></img>
            : null}
          <UserName userID={sittingUserID} defaultName="Empty seat"></UserName>
        </div>

        <div className="h-1/2 w-full cursor-default">
          {sitButton()}
          {/* <div 
            className={"h-full w-1/2 float-left flex justify-center"
            onClick={handleSitClick}
          >Sit</div> */}

          <div 
            className={"h-full w-1/2 float-left flex justify-center "+
              ((observingPlayerN===playerN) ? "bg-gray-500" : "hover:bg-gray-500")}
            onClick={() => handleObserveClick()}
          >Obsv</div>
        </div>

      </div>

      <div className="float-left h-full w-1/3">

        <div className="h-1/2 w-full">
          <div className="h-full w-1/2 float-left flex justify-end">
            <img className="h-full" src={process.env.PUBLIC_URL + '/images/tokens/threat.png'}></img>
          </div>
          <input 
            className="h-full w-1/2 float-left text-center bg-transparent" 
            value={threatValue}
            onChange={handleThreatChange}
            type="number" min="0" step="1"
          ></input>
        </div>

        <div className="h-1/2 w-full">
          <div className="h-full w-1/2 float-left flex justify-end">
            <img className="h-full" src={process.env.PUBLIC_URL + '/images/tokens/willpower.png'}></img>
          </div>
          <input 
            className="h-full w-1/2 float-left text-center bg-transparent" 
            defaultValue={gameUI["game"]["playerById"][playerN]["willpower"]}
            type="number" min="0" step="1"
          ></input>
        </div>
      </div>
      
    </div>
  )
})