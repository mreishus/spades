import React from "react";
//import classnames from "classnames";

import useDataApi from "../hooks/useDataApi";
import useChannel from "../hooks/useChannel";

interface Props {}

const eventReducer = (state: any, action: any) => {
  console.log({ state, action });
  return state;
};

export const TestMe = () => {
  const { data, isLoading, isError } = useDataApi(`/be/json_test`, null);

  const initialState = {
    createRepo: "init"
  };
  const a = useChannel("mytopic:mysubtopic", eventReducer, initialState);
  console.log({ a });

  return (
    <div>
      TestMeComponent
      <div>Another tdiv</div>
      {isLoading && <span>Loading</span>}
      {isError && <span>Error</span>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
};
export default TestMe;
