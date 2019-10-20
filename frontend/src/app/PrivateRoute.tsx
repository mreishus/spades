import React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<Props & RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isAuthenticated = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};
export default PrivateRoute;
