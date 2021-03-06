import React, {useState, useContext, useEffect} from "react";
import ReactDOM from "react-dom";
import { Table } from "./Table";
import { useKeypress, useSetKeypress} from "../../contexts/KeypressContext";
import GameUIContext from "../../contexts/GameUIContext";
import { ChatMessage } from "elixir-backend";
import { HandleKeyDown } from "./HandleKeyDown";
import { GetPlayerN } from "./Helpers";
import useProfile from "../../hooks/useProfile";



interface Props {
  gameBroadcast: (eventName: string, payload: object) => void;
  chatBroadcast: (eventName: string, payload: object) => void;
  messages: Array<ChatMessage>;
}

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

const RoomGame: React.FC<Props> = ({ gameBroadcast, chatBroadcast, messages }) => {
  console.log('rendering roomgame');
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
  const { gameUI, setGameUI } = useContext(GameUIContext);
  const [typing, setTyping] = useState<Boolean>(false);
  const keypress = useKeypress();
  const setKeypress = useSetKeypress();
  const myUser = useProfile();
  const myUserID = myUser?.id;
  const playerN = GetPlayerN(gameUI["playerIds"], myUserID);
  console.log(gameUI);
  return (
    <div className="h-full w-full">
      <HandleKeyDown
        playerN={playerN}
        gameUI={gameUI}
        typing={typing}
        keypress={keypress}
        setKeypress={setKeypress}
        gameBroadcast={gameBroadcast} 
        chatBroadcast={chatBroadcast}
      />
      <Table 
        playerN={playerN}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        messages={messages}
        setTyping={setTyping}
      />
    </div>
  )
}   

export default RoomGame;
