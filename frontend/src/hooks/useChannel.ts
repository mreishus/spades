import { useContext, useEffect, useState } from "react";
import { Socket } from "phoenix";
import SocketContext from "../contexts/SocketContext";

/* useChannel is used to provide access to phoenix channels.

example usage showing communication in both directions:

interface Props {}
export const TestComponent: React.FC<Props> = () => {
  const onChannelMessage = useCallback((event, payload) => {
    console.log("Got channel message from phoenix", event, payload);
  }, []);
  const broadcast = useChannel("lobby:lobby", onChannelMessage);
  return (
    <button
      onClick={() => broadcast("test_message_from_javascript", { stuff: 1 })}
    >
      Send message to phoenix
    </button>
  );
};

this is adapated from alexgriff/use-phoenix-channel with the following changes:
1. Ported to typescript
2. Does not force you to use a reducer.

Note: It does require access to a phoenix socket object, built like so:

import { Socket } from 'phoenix';
const socket = new Socket(webSocketUrl, {params: options});
socket.connect();

It looks for this in SocketContext.  See
https://medium.com/flatiron-labs/improving-ux-with-phoenix-channels-react-hooks-8e661d3a771e
for an example implementation.

*/

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
    // I think all of these chan_reply_ events are not needed?
    if (!event.startsWith("chan_reply_")) {
      onMessage(event, payload);
    }
    // Return the payload since we're using the
    // special onMessage hook
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
