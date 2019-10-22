import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Container from "../../components/basic/Container";

import useDataApi from "../../hooks/useDataApi";
import useAuth from "../../hooks/useAuth";

type TParams = { confirm_token: string };
interface Props extends RouteComponentProps<TParams> {}

export const ConfirmEmail: React.FC<Props> = ({ match }) => {
  const { authToken } = useAuth();
  const {
    params: { confirm_token }
  } = match;

  // TODO: make useDataApi check for specific error messages
  // coming from the API, the way the login post does.
  const { isLoading, isError, data } = useDataApi(
    `/be/api/v1/confirm-email/${confirm_token}`,
    null
  );

  const isConfirmed = data != null && data.success != null;

  return (
    <Container>
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className="alert alert-danger max-w-md">
          Sorry, that's an invalid or expired confirmation link.
        </div>
      )}
      {isConfirmed && (
        <div className="alert alert-info max-w-md">
          Thank you, your email has been confirmed.
          {!authToken && (
            <div className="mt-2">
              <Link to="/login" className="text-lg">
                Log In
              </Link>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};
export default ConfirmEmail;
