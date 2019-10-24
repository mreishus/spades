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
      <div className="mx-auto max-w-sm mt-20 p-8 bg-gray-100 rounded-lg shadow-lg">
        {isLoading && <div>Loading...</div>}
        {isError && (
          <div className="text-red-800 font-semibold text-xl">
            Sorry, that's an invalid or expired confirmation link.
          </div>
        )}
        {isConfirmed && (
          <div className="text-blue-900 font-semibold text-2xl">
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
      </div>
    </Container>
  );
};
export default ConfirmEmail;
