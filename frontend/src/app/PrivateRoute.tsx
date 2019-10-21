import React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router";
import useAuth from "../hooks/useAuth";

interface Props {
  component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<Props & RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { authToken } = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        authToken ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
export default PrivateRoute;
