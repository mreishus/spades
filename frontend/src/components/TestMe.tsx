import React from "react";
//import classnames from "classnames";

import useDataApi from "../hooks/useDataApi";

interface Props {}

export const TestMe = () => {
  const { data, isLoading, isError } = useDataApi(`/be/json_test`, null);
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
