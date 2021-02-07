import React from "react";

export const MenuBarUser = React.memo(({
  gameUI,
  PlayerN,
  gameBroadcast,
  chatBroadcast
}) => {
  const username = gameUI["game"]["players"][PlayerN]["username"];
  
  return(
    <div className="float-left h-full" style={{width: "15%"}}>
      <div className="float-left h-full w-2/3">
        <div className="h-1/2 w-full flex justify-center">
          {(gameUI["game"]["first_player"] === PlayerN) ? 
            <img className="h-full mr-1 mb-1" src={process.env.PUBLIC_URL + '/images/tokens/firstplayer.png'}></img>
            : null}
          {username ? username : PlayerN}
        </div>

        <div className="h-1/2 w-full cursor-default">
          <div className="h-full w-1/2 float-left flex justify-center hover:bg-gray-500">Sit</div>
          <div className="h-full w-1/2 float-left flex justify-center hover:bg-gray-500">Obsv</div>
        </div>

      </div>

      <div className="float-left h-full w-1/3">

        <div className="h-1/2 w-full">
          <div className="h-full w-1/2 float-left flex justify-end">
            <img className="h-full" src={process.env.PUBLIC_URL + '/images/tokens/threat.png'}></img>
          </div>
          <input 
            className="h-full w-1/2 float-left text-center bg-transparent" 
            defaultValue={gameUI["game"]["players"]["Player1"]["threat"]}
            type="number" min="0" step="1"
          ></input>
        </div>

        <div className="h-1/2 w-full">
          <div className="h-full w-1/2 float-left flex justify-end">
            <img className="h-full" src={process.env.PUBLIC_URL + '/images/tokens/willpower.png'}></img>
          </div>
          <input 
            className="h-full w-1/2 float-left text-center bg-transparent" 
            defaultValue={gameUI["game"]["players"]["Player1"]["threat"]}
            type="number" min="0" step="1"
          ></input>
        </div>
      </div>
      
    </div>
  )
})