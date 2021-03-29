import React from "react";

export const MenuBarShared = React.memo(({
  round,
  threat,
  progress
}) => {
    return(
      <div className="float-left h-full bg-gray-600" style={{width: "16%"}}>
        <div className="float-left h-full w-1/3">
          <div className="h-1/2 w-full flex justify-center">
            Round
          </div>
          <div className="h-1/2 w-full flex justify-center">
            <div className="text-xl">{round}</div>
            <img className="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/time.png'}></img>
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