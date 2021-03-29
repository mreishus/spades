import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import RoomGame from "./RoomGame";
import GameUIContext from "../../contexts/GameUIContext";
import {useSetMessages} from '../../contexts/MessagesContext';
import {KeypressProvider} from '../../contexts/KeypressContext';
import {ActiveCardProvider} from '../../contexts/ActiveCardContext';
import useChannel from "../../hooks/useChannel";
import { setGameUi, setGame } from "./gameUiSlice";

export const Room = ({ slug }) => {
  const gameNameStore = state => state.gameUi.gameName;
  const dispatch = useDispatch();
  const gameName = useSelector(gameNameStore);
  const setMessages = useSetMessages();

  //const [gameUI, setGameUI] = useState<GameUI | null>(null);
  const onChannelMessage = useCallback((event, payload) => {
    console.log("[room] Got channel message", event, payload);
    console.log("Got new game state: ", payload.response);
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.game_ui != null
    ) {
      const { game_ui } = payload.response;
      console.log("dispatching to game", game_ui)
      if (game_ui) {
        dispatch(setGame(game_ui.game));
        dispatch(setGameUi(game_ui));
      }
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
      // <Container>
        <div className="gamebackground"
          style={{height: "97vh"}}
        >
            <KeypressProvider value={{Shift: false}}>
              <ActiveCardProvider value={null}>
                <RoomGame gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}/>
              </ActiveCardProvider>
            </KeypressProvider>
        </div>
      // </Container>
    );
  }
};
export default Room;
