import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import { Groups } from "./Groups";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import {useSetKeypress} from "../../contexts/KeypressContext";

var delayBroadcast: number;

const keyTokenMap: { [id: string] : Array<string | number>; } = {
  "1": ["resource",1],
  "2": ["progress",1],
  "3": ["damage",1],
  "4": ["time",1],
  "5": ["threat",1],
  "6": ["willpower",1],
  "7": ["attack",1],
  "8": ["defense",1],
  "q": ["resource",-1],
  "w": ["progress",-1],
  "e": ["damage",-1],
  "r": ["time",-1],
  "t": ["threat",-1],
  "y": ["willpower",-1],
  "u": ["attack",-1],
  "i": ["defense",-1],
}

interface Props {
  broadcast: (eventName: string, payload: object) => void;
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
//           broadcast={this.props.broadcast}
//         />
//     )
//   }

// 

const RoomGame: React.FC<Props> = ({ broadcast }) => {
  console.log('rendering roomgame');
  //const gameUIView = React.useContext(GameUIViewContext);
  //if (gameUIView) broadcast("update_groups",{groups: gameUIView.game_ui.game.groups});

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

  const setKeypress = useSetKeypress();
  const activeCardAndLoc = useActiveCard();
  const setActiveCardAndLoc = useSetActiveCard();
  const [keyDownList, setKeyDownList] = useState<Array<string>>([]);

  useEffect(() => {
    const onKeyDown = (event: any) => {
      const k = event.key;
      setKeypress([event.key]);
      if (activeCardAndLoc != null) {
          //var newList = keyDownList.concat(event.key);
          //setKeyDownList(newList);
          //if (delayBroadcast) clearTimeout(delayBroadcast);
          //delayBroadcast = setTimeout(function() {
              
              var newCard = activeCardAndLoc.card;
              var newTokens = newCard.tokens;
            //  newList.forEach( k => {
                // Check for token updates
                if (keyTokenMap[k] != undefined) {
                  const tokenType = keyTokenMap[k][0];
                  const increment = keyTokenMap[k][1];
                  newTokens = {
                    ...newTokens,
                    [tokenType]: newTokens[tokenType]+increment,
                  }
                  newCard = {...newCard, tokens: newTokens}
                  broadcast("increment_token",{group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex, token_type: tokenType, increment: increment})
                }
                // Set tokens to 0
                if (k === "0") {
                  newTokens = {
                    ...newTokens,
                    "resource": 0,
                    "progress": 0,
                    "damage": 0,
                    "time": 0,
                    "threat": 0,
                    "willpower": 0,
                    "attack": 0,
                    "defense": 0,
                  }
                  newCard = {...newCard, tokens: newTokens}
                  broadcast("update_card", {card: newCard, group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
                }
                // Flip card
                if (k === "f") {
                  if (newCard.currentSide === "A") {
                    newCard = {...newCard, currentSide: "B"}
                  } else {
                    newCard = {...newCard, currentSide: "A"}
                  }
                  broadcast("update_card", {card: newCard, group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
                }
                // Exhaust card
                if (k === "a") {
                  if (newCard.exhausted) {
                    newCard = {...newCard, exhausted: false, rotation: 0}
                  } else {
                    newCard = {...newCard, exhausted: true, rotation: 90}
                  }
                  broadcast("update_card", {card: newCard, group_id: activeCardAndLoc.groupID, stack_index: activeCardAndLoc.stackIndex, card_index: activeCardAndLoc.cardIndex});
                }
              }
              //);
              //newCard = {...newCard, tokens: newTokens}
              // If activeCard has not changed ,refresh activeCard to new value
              if (activeCardAndLoc) setActiveCardAndLoc({card: newCard, groupID: activeCardAndLoc.groupID, stackIndex: activeCardAndLoc.stackIndex, cardIndex: activeCardAndLoc.cardIndex});
              //
              //setKeyDownList([]);
          //}, 300);
        //}
      //}
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
  }, [activeCardAndLoc, keyDownList]);


  return (
      <Groups 
        broadcast={broadcast}
      />
    
  )
}   

export default RoomGame;
