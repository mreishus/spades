import React, { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import RoomGame from "./RoomGame";
import {useSetMessages} from '../../contexts/MessagesContext';
import {KeypressProvider} from '../../contexts/KeypressContext';
import {ActiveCardProvider} from '../../contexts/ActiveCardContext';
import {DropdownMenuProvider} from '../../contexts/DropdownMenuContext';
import {MousePositionProvider} from '../../contexts/MousePositionContext';
import useChannel from "../../hooks/useChannel";
import { setGameUi, setGame } from "./gameUiSlice";
import { GetPlayerN } from "./Helpers";
import useProfile from "../../hooks/useProfile";

export const Room = ({ slug }) => {
  const dispatch = useDispatch();
  const gameUiStore = state => state.gameUi;
  const gameUi = useSelector(gameUiStore);
  const gameNameStore = state => state.gameUi.gameName;
  const gameName = useSelector(gameNameStore);
  const errorStore = state => state.gameUi.error;
  const error = useSelector(errorStore);
  const setMessages = useSetMessages();
  const storePlayerIds = state => state?.gameUi?.playerIds;
  const playerIds = useSelector(storePlayerIds);
  const myUser = useProfile();
  const myUserID = myUser?.id;
  
  const playerN = GetPlayerN(playerIds, myUserID);

  //const [gameUI, setGameUI] = useState<GameUI | null>(null);
  const onChannelMessage = useCallback((event, payload) => {
    if (!payload) return;
    console.log("[room] Got channel message", event, payload);
    console.log("Got new game state: ", payload.response);
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.game_ui != null
    ) {
      const { game_ui } = payload.response;
      console.log("dispatching to game", game_ui)
      if (game_ui.error && !error) {
        alert("An error occured.");
      }
      dispatch(setGame(game_ui.game));
      dispatch(setGameUi(game_ui));
    }

  }, []);
  
  //const [messages, setMessages] = useState([]);

  const onChatMessage = useCallback((event, payload) => {
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.messages != null
    ) {
      setMessages(payload.response.messages);
    }
  }, []);
  const gameBroadcast = useChannel(`room:${slug}`, onChannelMessage);
  const chatBroadcast = useChannel(`chat:${slug}`, onChatMessage);

  console.log('rendering room');

  if (gameName !== slug) return (<div></div>);
  else {
    return (
        <div className="background"
          style={{
            height: "97vh",
            background: `url(${myUser?.background_url ? myUser.background_url : "https://i.imgur.com/sHn4yAA.jpg"})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPositionY: "50%",
          }}
        >
            <KeypressProvider value={{Shift: false}}>
              <MousePositionProvider value={null}>
                <DropdownMenuProvider value={null}>
                  <ActiveCardProvider value={null}>
                    <RoomGame playerN={playerN} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}/>
                  </ActiveCardProvider>
                </DropdownMenuProvider>
              </MousePositionProvider>
            </KeypressProvider>
        </div>
    );
  }
};
export default Room;
