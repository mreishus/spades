import { useContext, useEffect, useReducer, useState } from "react";
import { Socket } from "phoenix";
import SocketContext from "../contexts/SocketContext";

const useChannel = (
  channelTopic: string,
  reducer: (state: any, event_and_payload: any) => any,
  initialState: any
) => {
  const socket = useContext(SocketContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [broadcast, setBroadcast] = useState(mustJoinChannelWarning);

  useEffect(() => {
    if (socket != null) {
      joinChannel(socket, channelTopic, dispatch, setBroadcast);
    }
  }, [channelTopic, socket]);

  return [state, broadcast];
};

const joinChannel = (
  socket: Socket,
  channelTopic: string,
  dispatch: React.Dispatch<any>,
  setBroadcast: React.Dispatch<React.SetStateAction<() => void>>
) => {
  const channel = socket.channel(channelTopic, { client: "browser" });

  channel.onMessage = (event, payload) => {
    dispatch({ event, payload });
    return payload;
  };

  channel
    .join()
    .receive("ok", ({ messages }) =>
      console.log("successfully joined channel", messages || "")
    )
    .receive("error", ({ reason }) =>
      console.error("failed to join channel", reason)
    );

  setBroadcast(() => channel.push.bind(channel));

  return () => {
    channel.leave();
  };
};

const mustJoinChannelWarning = () => () =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`
  );

export default useChannel;
