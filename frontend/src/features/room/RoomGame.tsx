import React, {useEffect} from "react";
import { Groups } from "./Groups";
import {ActiveCardProvider} from '../../contexts/ActiveCardContext'
import {useSetKeypress} from "../../contexts/KeypressContext";

interface Props {
  broadcast: (eventName: string, payload: object) => void;
}

const RoomGame: React.FC<Props> = ({ broadcast }) => {
  console.log('rendering roomgame');
  //const gameUIView = React.useContext(GameUIViewContext);
  //if (gameUIView) broadcast("update_groups",{groups: gameUIView.game_ui.game.groups});
  const setKeypress = useSetKeypress();

  useEffect(() => {

    const onKeyDown = (event: any) => {
      console.log(event.key);
      setKeypress([event.key]);
    }

    const onKeyUp = (event: any) => {
      console.log(event.key);
      setKeypress([""]);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ActiveCardProvider value={null}>
      <Groups 
        broadcast={broadcast}
      />
    </ActiveCardProvider>
    
  )
}   

export default RoomGame;
