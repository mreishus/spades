import React, {useState, useContext, useEffect} from "react";
import ReactDOM from "react-dom";
import { Table } from "./Table";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { useKeypress, useSetKeypress} from "../../contexts/KeypressContext";
import GameUIContext from "../../contexts/GameUIContext";
import { ChatMessage } from "elixir-backend";
import { handleKeyDown } from "./HandleKeyDown";



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
  //if (gameUIView) gameBroadcast("update_groups",{groups: gameUIView.game_ui.game.groups});

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
  const activeCardAndLoc = useActiveCard();
  const setActiveCardAndLoc = useSetActiveCard();

  useEffect(() => {
    const onKeyDown = (event: any) => {
      handleKeyDown(
        event, 
        gameUI,
        typing, 
        keypress, 
        setKeypress,
        activeCardAndLoc,
        setActiveCardAndLoc, 
        gameBroadcast, 
        chatBroadcast,
      )
    }

    const onKeyUp = (event: any) => {
      setKeypress([""]);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameUI, typing, keypress, activeCardAndLoc]);


  return (
      <Table 
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        messages={messages}
        setTyping={setTyping}
      />
    
  )
}   

export default RoomGame;
