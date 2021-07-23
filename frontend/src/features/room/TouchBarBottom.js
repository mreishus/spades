import React from "react";
import { useSetTouchAction, useTouchAction } from "../../contexts/TouchActionContext";

export const TouchButton = React.memo(({
  text,
  action,
}) => {
  const touchAction = useTouchAction();
  const setTouchAction = useSetTouchAction();
  // Check if action is selected
  var selected = false;
  if (touchAction?.action === action.action) selected = true;
  if (
    touchAction?.action === "increment_token" && 
    (touchAction?.options.tokenType !== action.options.tokenType || touchAction?.options.increment !== action.options.increment)
  ) selected = false;
  const bgColor = selected ? " bg-red-700" : " bg-gray-600";
  const hoverColor = selected ? "" : " hover:bg-gray-500"
  const handleClick = () => {
    if (selected) setTouchAction(null); else setTouchAction(action);
  }
  var justify = " justify-center";
  if (text === "+" || text === "−") justify = " justify-start";
  return (
    <div onClick={() => handleClick()} className={"absolute cursor-default h-full w-full p-0.5 top-0" + (text.length === 1 ? " text-xl" : " text-xs")}>
      <div className={"flex rounded-lg w-full h-full text-center items-center" + justify + bgColor + hoverColor}>
        {text}
      </div>
    </div>
  )
})

export const TouchButtonGame = React.memo(({
  text,
  action,
}) => {
  const touchAction = useTouchAction();
  const setTouchAction = useSetTouchAction();
  const selected = false;
  const bgColor = selected ? " bg-red-700" : " bg-gray-600";
  const hoverColor = selected ? "" : " hover:bg-gray-500"
  const handleClick = () => {
    if (selected) setTouchAction(null); else setTouchAction(action);
  }
  var justify = " justify-center";
  return (
    <div onClick={() => handleClick()} className={"absolute cursor-default h-full w-full p-0.5 top-0" + (text.length === 1 ? " text-xl" : " text-xs")}>
      <div className={"flex rounded-lg w-full h-full text-center items-center" + justify + bgColor + hoverColor}>
        {text}
      </div>
    </div>
  )
})


export const TouchBarBottom = React.memo(({}) => {
  const iconImg = (tokenType) => {
    return(
      <img className="relative text-center pointer-events-none m-auto h-6" style={{opacity:"50%"}} src={process.env.PUBLIC_URL + '/images/tokens/'+tokenType+'.png'}/>
    )
  }
  const containerClass = "relative text-center";
  const containerStyle = {};
  
  return (
    <table className="table-fixed w-full h-full text-white text-xs">
      <tr className={"bg-gray-700"} style={{height: "50%", maxHeight: "50%"}}>
        <td className={containerClass} style={containerStyle}>
          <TouchButton
          text={"Remove tokens"} 
          action={{action: "zero_tokens", options: {}}}/>
        </td>
        {["resource", "progress", "damage", "time", "willpowerThreat", "attack", "defense", "hitPoints"].map((tokenType, _index) => {
          return (
            <td className={containerClass} style={containerStyle}>
              <TouchButton
                text={"+"}
                action={{action: "increment_token", options: {tokenType: tokenType, increment: 1}}}/>
                {tokenType === "willpowerThreat" ? <>{iconImg("willpower")}{iconImg("threat")}</> : iconImg(tokenType)}
            </td>
          )
        })}
        {[["Exhaust Ready", "toggle_exhaust"], 
          ["Commit", "toggle_commit"], 
          ["Shuffle into deck", "shuffle_into_deck"], 
          ["Flip", "flip"], 
          ["Shadow", "deal_shadow"], 
          ["Discard", "discard"]
        ].map((titleAction, _index) => {
          return (
            <td className={containerClass} style={containerStyle}>
              <TouchButton
                text={titleAction[0]}
                action={{action: titleAction[1], options: {}}}/>
            </td>
          )
        })}
        <td className={containerClass} style={containerStyle}>More</td>
        {/* <td className={containerClass} style={containerStyle}>Target</td>
        <td className={containerClass} style={containerStyle}>Victory</td>
        <td className={containerClass} style={containerStyle}>Arrow</td> */}
      </tr>
      <tr className={"bg-gray-700"} style={{height: "50%"}}>
        {[["Draw", "draw"], 
          ["Reveal", "reveal"], 
          ["Reveal #2", "reveal_from_second"], 
          ["Mulligan", "mulligan"], 
          ["New round", "new_round"],
          ["Shadows", "shadows"],
          ["Discard shadows", "discard_shadows"],
          ["Refresh", "refresh"],
          ["Clear targets", "clear_targets"],
          ["Undo", "undo"],
          ["Undo many", "undo_many"],
          ["Redo", "redo_many"],
          ["Next step", "next_step"],
          ["Save", "save"],
          ].map((titleAction, _index) => {
            return (
              <td className={containerClass} style={containerStyle}>
                <TouchButton
                  text={titleAction[0]}
                  action={{action: titleAction[1], options: {}, type: "game"}}/>
              </td>
            )
          })}
      </tr>
    </table>
  )
})