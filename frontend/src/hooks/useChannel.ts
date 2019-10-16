//
// Lots of ANYs in here.  This is a placeholder I got from a webpage.
// I'm not sure I like the way this ties together the state management,
// forcing you to use useReducer.
// This needs an overhaul, but leaving it in as I test prod connectivity.
//
import { useContext, useReducer, useEffect } from "react";
import SocketContext from "../contexts/SocketContext";

const useChannel = (channelTopic: string, reducer: any, initialState: any) => {
  const socket = useContext(SocketContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // @ts-ignore
    if (socket === {} || socket.channel == null) {
      return;
    }
    // @ts-ignore
    const channel = socket.channel(channelTopic, { client: "browser" });

    channel.onMessage = (event: any, payload: any) => {
      dispatch({ event, payload });
      return payload;
    };

    channel
      .join()
      .receive("ok", ({ messages }: { messages: any }) =>
        console.log("successfully joined channel", messages || "")
      )
      .receive("error", ({ reason }: { reason: any }) =>
        console.error("failed to join channel", reason)
      );

    return () => {
      channel.leave();
    };
  }, [channelTopic, socket]);

  return state;
};

export default useChannel;
