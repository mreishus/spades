import React, {useState, useContext, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReactDOM from "react-dom";
import { Table } from "./Table";
import { useKeypress, useSetKeypress} from "../../contexts/KeypressContext";
import GameUIContext from "../../contexts/GameUIContext";
import { HandleKeyDown } from "./HandleKeyDown";
import { GetPlayerN } from "./Helpers";
import { DragContainer } from "./DragContainer";
import useProfile from "../../hooks/useProfile";

// class RoomGame extends React.Component<Props> {

//   handleKeyDown(event: any) {
//     let ac = ReactDOM.findDOMNode(this)?.getElementsByClassName('isActive') // Returns the elements
//     console.log(event.key);
//   }

//   componentWillMount(): void {
//     window.addEventListener('keydown', this.handleKeyDown);
//   }

//   componentWillUnmount(): void {
//     window.removeEventListener('keydown', this.handleKeyDown);
//   }

//   render() {
//     return(
//         <Groups 
//           gameBroadcast={this.props.gameBroadcast}
//         />
//     )
//   }

// 

const RoomGame = React.memo(({ gameBroadcast, chatBroadcast, messages }) => {
  console.log('rendering roomgame');
  const storePlayerIds = state => state?.gameUi?.playerIds;
  const playerIds = useSelector(storePlayerIds);
  const [typing, setTyping] = useState(false);
  const keypress = useKeypress();
  const setKeypress = useSetKeypress();
  const myUser = useProfile();
  const myUserID = myUser?.id;
  if (!playerIds) return null;
  //const gameUIView = React.useContext(GameUIViewContext);

/*   const setKeypress = useSetKeypress();
  const activeCard = useActiveCard();

  const onKeyDown = (event: any) => {
      console.log(event.key);
      setKeypress([event.key]);
      if (activeCard) {
        if (event.key === "1") {
          console.log("Logged activeCard",activeCard);
        }
      }
      document.removeEventListener('keydown', onKeyDown);
  }
  const onKeyUp = (event: any) => {
      console.log(event.key);
      setKeypress([]);
      document.removeEventListener('keyup', onKeyUp);
  }
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
 */
  //const { gameUI, setGameUI } = useContext(GameUIContext);
  const playerN = GetPlayerN(playerIds, myUserID);
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
        messages={messages}
        setTyping={setTyping}
      />
    </div>
  )
})

export default RoomGame;
