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
    (touchAction?.options.tokenType !== action.options.tokenType)
  ) selected = false;
  const bgColor = selected ? " bg-red-700" : " bg-gray-600";
  const hoverColor = selected ? "" : " hover:bg-gray-500"
  const handleClick = () => {
    if (selected) {
      if (touchAction?.action === "increment_token" && touchAction.options.increment === 1) {
        setTouchAction(
          {...touchAction, options: {...touchAction.options, increment: -1}}
        )
      } else {
        setTouchAction(null); 
      }
    } 
    else setTouchAction(action);
  }
  var justify = " justify-center";
  var displayText = text;
  if (text === "" && selected && touchAction?.options.increment === 1) displayText = <div style={{fontSize: "54px", textShadow: "rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.75517px 0.958851px 0px, rgb(0, 0, 0) 1.0806px 1.68294px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.81859px 0px, rgb(0, 0, 0) -1.60229px 1.19694px 0px, rgb(0, 0, 0) -1.97999px 0.28224px 0px, rgb(0, 0, 0) -1.87291px -0.701566px 0px, rgb(0, 0, 0) -1.30729px -1.51361px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.91785px 0px, rgb(0, 0, 0) 1.41734px -1.41108px 0px, rgb(0, 0, 0) 1.92034px -0.558831px 0px"}}>+</div>;
  if (text === "" && selected && touchAction?.options.increment === -1) displayText = <div style={{fontSize: "54px", textShadow: "rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.75517px 0.958851px 0px, rgb(0, 0, 0) 1.0806px 1.68294px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.81859px 0px, rgb(0, 0, 0) -1.60229px 1.19694px 0px, rgb(0, 0, 0) -1.97999px 0.28224px 0px, rgb(0, 0, 0) -1.87291px -0.701566px 0px, rgb(0, 0, 0) -1.30729px -1.51361px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.91785px 0px, rgb(0, 0, 0) 1.41734px -1.41108px 0px, rgb(0, 0, 0) 1.92034px -0.558831px 0px"}}>−</div>;

  return (
    <div onClick={() => handleClick()} className={"absolute cursor-default h-full w-full p-0.5 top-0" + (text.length === 1 ? " text-xl" : " text-xs")}>
      <div className={"flex rounded-lg w-full h-full text-center items-center" + justify + bgColor + hoverColor}>
        {displayText}
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
          action={{action: "zero_tokens", options: {}, type: "card"}}/>
        </td>
        {["resource", "progress", "damage", "time", "willpowerThreat", "attack", "defense", "hitPoints"].map((tokenType, _index) => {
          return (
            <td className={containerClass} style={containerStyle}>
              <TouchButton
                text={""}
                action={{action: "increment_token", options: {tokenType: tokenType, increment: 1}, type: "card"}}/>
                {tokenType === "willpowerThreat" ? <>{iconImg("willpower")}{iconImg("threat")}</> : iconImg(tokenType)}
            </td>
          )
        })}
        {[["Exhaust Ready", "toggle_exhaust"], 
          ["Commit", "commit"], 
          ["Shuffle into deck", "shuffle_into_deck"], 
          ["Flip", "flip"], 
          ["Shadow", "deal_shadow"], 
          ["Discard", "discard"],
          ["Target", "target"],
          ["Victory", "victory"],
          ["Draw arrow", "draw_arrow"]
        ].map((titleAction, _index) => {
          return (
            <td className={containerClass} style={containerStyle}>
              <TouchButton
                text={titleAction[0]}
                action={{action: titleAction[1], options: {}, type: "card"}}/>
            </td>
          )
        })}
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