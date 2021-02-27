import React from "react";
import UserName from "../user/UserName";
import useProfile from "../../hooks/useProfile";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import { Link } from "react-router-dom";

export const MenuBarUser = React.memo(({
  gameUI,
  PlayerN,
  playerIndex,
  gameBroadcast,
  chatBroadcast,
  observingPlayerN,
  setObservingPlayerN,
}) => {
  const isLoggedIn = useIsLoggedIn();
  const myUser = useProfile();
  const myUserID = myUser?.id;
  const sittingUserID = gameUI["player_ids"][PlayerN];
  console.log('rendering '+PlayerN);

  const handleSitClick = (action) => {
    // Get up from any seats first
    Object.keys(gameUI["player_ids"]).forEach((PlayerI) => {
      const sittingUserIDi = gameUI["player_ids"][PlayerI];
      if (sittingUserIDi === myUserID) {
        gameBroadcast("get_up",{"PlayerN": PlayerI});
        chatBroadcast("game_update",{message: "got up from "+PlayerI+"'s seat."});
      }
    })
    // Sit in seat
    if (action === "sit") {
      gameBroadcast("sit",{"PlayerN": PlayerN});
      chatBroadcast("game_update",{message: "sat in "+PlayerN+"'s seat."});
      setObservingPlayerN(PlayerN);
    } 
  }

  const handleObserveClick = () => {
    if (observingPlayerN === PlayerN) {
      setObservingPlayerN(null);
      chatBroadcast("game_update",{message: "stopped observing "+PlayerN+"."});
    } else {
      setObservingPlayerN(PlayerN);
      chatBroadcast("game_update",{message: "started observing "+PlayerN+"."});
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
          {(gameUI["game"]["first_player"] === PlayerN) ? 
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
              ((observingPlayerN===PlayerN) ? "bg-gray-500" : "hover:bg-gray-500")}
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
            defaultValue={gameUI["game"]["player_data"][PlayerN]["threat"]}
            type="number" min="0" step="1"
          ></input>
        </div>

        <div className="h-1/2 w-full">
          <div className="h-full w-1/2 float-left flex justify-end">
            <img className="h-full" src={process.env.PUBLIC_URL + '/images/tokens/willpower.png'}></img>
          </div>
          <input 
            className="h-full w-1/2 float-left text-center bg-transparent" 
            defaultValue={gameUI["game"]["player_data"][PlayerN]["willpower"]}
            type="number" min="0" step="1"
          ></input>
        </div>
      </div>
      
    </div>
  )
})