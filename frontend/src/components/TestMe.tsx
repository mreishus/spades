import React from "react";
//import classnames from "classnames";

import useDataApi from "../hooks/useDataApi";
import useChannelOld from "../hooks/useChannelOld";

interface Props {}

const eventReducer = (state: any, action: any) => {
  if (action.event === "ping") {
    return action.payload;
  }
  return state;
};

export const TestMe = () => {
  const { data, isLoading, isError } = useDataApi(`/be/json_test`, null);

  const initialState = {
    createRepo: "init"
  };
  const [channelState, broadcast] = useChannelOld(
    "mytopic:mysubtopic",
    eventReducer,
    initialState
  );
  console.log("state");
  console.log(channelState);

  return (
    <div>
      TestMeComponent
      <div>Another tdiv</div>
      {isLoading && <span>Loading</span>}
      {isError && <span>Error</span>}
      {data && <div>{JSON.stringify(data)}</div>}
      <button
        className="bg-orange-800"
        onClick={() => broadcast("thisevent", { some: "payload" })}
      >
        Send event over websocket
      </button>
    </div>
  );
};
export default TestMe;
