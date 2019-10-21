import Container from "./basic/Container";
import React from "react";
import useNewDataApi from "../hooks/useNewDataApi";
import Button from "../components/basic/Button";

interface Props {}

export const AuthTest: React.FC<Props> = () => {
  const { isLoading, isError, data, doFetchHash: setHash } = useNewDataApi(
    "/be/api/authtest",
    null
  );

  return (
    <Container>
      <div>
        This is the auth test page
        <div>got from API</div>
        <div className="mt-4 p-2 bg-blue-200 max-w-lg rounded">
          <pre>{JSON.stringify(data)}</pre>
        </div>
        {isLoading && <div>Is loading</div>}
        {isError && <div>Is error</div>}
        <Button className="mt-2" onClick={() => setHash(Math.random())}>
          Refetch
        </Button>
      </div>
    </Container>
  );
};
export default AuthTest;
