import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Draggable from 'react-draggable';

const keyClass = "m-auto border rounded-md w-6 h-6 bg-gray-500 text-center bottom inline-block";
const keyClassLong = "m-auto border rounded-md w-12 h-6 bg-gray-500 text-center bottom inline-block";
const windowClass = "insert-auto overflow-auto bg-gray-700 border max-w-lg rounded-lg outline-none text-white";
const windowStyle = {
  position:"absolute", 
  zIndex: 1e7, 
  right: "30px", 
  top: "200px", 
  width:"400px", 
  height: "550px",
}
const col1Class = "w-1/3";
const col2Class = "w-2/3";

export const Hotkeys = React.memo(({
    setShowHotkeys,
}) => {
  const iconImg = (tokenType) => {
    return(<img className="m-auto h-6" src={process.env.PUBLIC_URL + '/images/tokens/'+tokenType+'.png'}/>)
  }

  return(
    <Draggable>
      <div className={windowClass} style={windowStyle}>
        <div className="w-full bg-gray-500" style={{height: "25px"}}>
          <FontAwesomeIcon className="ml-2" icon={faTimes} onClick={() => setShowHotkeys(false)}/>
        </div>
        <div className="w-full p-3 overflow-y-scroll" style={{height: "523px"}}>
          <h2 className="mb-2">Tokens</h2>
          Hover over the top/bottom half of the card when pressing the key to add/remove tokens.
          <table className="table-fixed rounded-lg w-full">
            <tr className="bg-gray-800">
              <th className={col1Class}>Key</th>
              <th className={col2Class}>Description</th>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Shift</div></td>
              <td className="p-1 text-center">Display all tokens</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>0</div></td>
              <td className="text-center">Remove all tokens</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>1</div></td>
              <td className="text-center">{iconImg("resource")}</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>2</div></td>
              <td className="text-center">{iconImg("progress")}</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>3</div></td>
              <td className="text-center">{iconImg("damage")}</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>4</div></td>
              <td className="text-center">{iconImg("time")}</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>5</div></td>
              <td className="text-center">{iconImg("willpower")}/{iconImg("threat")}</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>6</div></td>
              <td className="text-center">{iconImg("attack")}</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>7</div></td>
              <td className="text-center">{iconImg("defense")}</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>8</div></td>
              <td className="text-center">{iconImg("hitPoints")}</td>
            </tr>
          </table>
          <br />
          <h2 className="mb-2">Card hotkeys</h2>
          Hover over a card.
          <table className="table-fixed rounded-lg w-full">
            <tr className="bg-gray-800">
                <th className={col1Class}>Key</th>
                <th className={col2Class}>Description</th>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>a</div></td>
              <td className="text-center">Exhaust / ready</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>f</div></td>
              <td className="text-center">Flip</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>h</div></td>
              <td className="text-center">Shuffle into owner's deck</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>q</div></td>
              <td className="text-center">Commit / uncommit from quest</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Shift</div><div className="inline-block p-1">+</div><div className={keyClass}>q</div></td>
              <td className="text-center">Commit / uncommit from quest without exhausting / readying</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>s</div></td>
              <td className="text-center">Deal shadow card</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>t</div></td>
              <td className="text-center">Target card</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>v</div></td>
              <td className="text-center">Add to victory display</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>w</div></td>
              <td className="text-center">Start/stop drawing arrow</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>x</div></td>
              <td className="text-center">Discard</td>
            </tr>
          </table>
          <br />
          <h2 className="mb-2">Game hotkeys</h2>
          <table className="table-fixed rounded-lg w-full">
            <tr className="bg-gray-800">
              <th className={col1Class}>Key</th>
              <th className={col2Class}>Description</th>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1"><div className={keyClass}>d</div></td>
              <td className="text-center">Draw card</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1"><div className={keyClass}>e</div></td>
              <td className="text-center">Reveal encounter card</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Shift</div>
              <div className="inline-block p-1">+</div>
              <div className={keyClass+" inline-block"}>e</div></td>
              <td className="text-center">Deal facedown encounter card</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Shift</div>
              <div className="inline-block p-1">+</div>
              <div className={keyClass+" inline-block"}>m</div></td>
              <td className="text-center">Mulligan</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Shift</div>
              <div className="inline-block p-1">+</div>
              <div className={keyClass+" inline-block"}>n</div></td>
              <td className="text-center">Draw card and gain resources. If host, increment round.</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Shift</div>
              <div className="inline-block p-1">+</div>
              <div className={keyClass+" inline-block"}>r</div></td>
              <td className="text-center">Refresh and raise threat. If host, move 1st player token.</td>
            </tr>
            <tr className={"bg-gray-500"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Shift</div>
              <div className="inline-block p-1">+</div>
              <div className={keyClass+" inline-block"}>s</div></td>
              <td className="text-center">Deal all shadow cards</td>
            </tr>
            <tr className={"bg-gray-600"}>
              <td className="p-1 text-center"><div className={keyClassLong}>Esc</div></td>
              <td className="text-center">Clear targets/arrows</td>
            </tr>
          </table>
        </div>
      </div>
    </Draggable>
  )
})