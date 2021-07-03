import React, { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import RoomProviders from "./RoomProviders";
import {useSetMessages} from '../../contexts/MessagesContext';
import useChannel from "../../hooks/useChannel";
import { setGameUi, setGame } from "./gameUiSlice";

export const Room = ({ slug }) => {
  const dispatch = useDispatch();
  const gameNameStore = state => state.gameUi.gameName;
  const gameName = useSelector(gameNameStore);
  const errorStore = state => state.gameUi.error;
  const error = useSelector(errorStore);
  const setMessages = useSetMessages();

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

  console.log('Rendering Room');

  if (gameName !== slug) return (<div></div>);
  else {
    return (
      <RoomProviders gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}/>
    );
  }
};
export default Room;
