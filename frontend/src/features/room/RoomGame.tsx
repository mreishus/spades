import React, {useEffect} from "react";
import { Groups } from "./Groups";
import { useActiveCard } from "../../contexts/ActiveCardContext";
import {useSetKeypress} from "../../contexts/KeypressContext";

interface Props {
  broadcast: (eventName: string, payload: object) => void;
}

const RoomGame: React.FC<Props> = ({ broadcast }) => {
  console.log('rendering roomgame');
  //const gameUIView = React.useContext(GameUIViewContext);
  //if (gameUIView) broadcast("update_groups",{groups: gameUIView.game_ui.game.groups});
  const setKeypress = useSetKeypress();
  const activeCard = useActiveCard();
  console.log("RoomGame activeCard",activeCard);

  const onKeyDown = (event: any) => {
      console.log(event.key);
      setKeypress([event.key]);
      console.log(activeCard);
  }
  const onKeyUp = (event: any) => {
      console.log(event.key);
      setKeypress([""]);
  }
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  return (
      <Groups 
        broadcast={broadcast}
      />
    
  )
}   

export default RoomGame;
