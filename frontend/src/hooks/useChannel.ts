import { useContext, useEffect, useState } from "react";
import { Socket } from "phoenix";
import SocketContext from "../contexts/SocketContext";

const useChannel = (
  channelTopic: string,
  onMessage: (event: any, payload: any) => void
) => {
  const socket = useContext(SocketContext);
  const [broadcast, setBroadcast] = useState<
    (eventName: string, payload: object) => void
  >(mustJoinChannelWarning);

  useEffect(() => {
    if (socket != null) {
      joinChannel(socket, channelTopic, onMessage, setBroadcast);
    }
  }, [channelTopic, onMessage, socket]);
  //}, [channelTopic, onMessage, socket]);

  return broadcast;
};

const joinChannel = (
  socket: Socket,
  channelTopic: string,
  onMessage: (event: any, payload: any) => void,
  setBroadcast: React.Dispatch<
    React.SetStateAction<(eventName: string, payload: object) => void>
  >
) => {
  const channel = socket.channel(channelTopic, { client: "browser" });

  channel.onMessage = (event, payload) => {
    onMessage(event, payload);
    // Phoenix.js makes us always return the payload...???
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

  setBroadcast((_oldstate: any) => (eventName: string, payload: object) =>
    channel.push(eventName, payload)
  );

  return () => {
    channel.leave();
  };
};

const mustJoinChannelWarning = (_oldstate: any) => (
  eventName: string,
  payload: object
) =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`
  );

export default useChannel;
