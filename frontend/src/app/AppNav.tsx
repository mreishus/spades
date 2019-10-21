import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface Props {}

export const AppNav: React.FC<Props> = () => {
  const { authToken, logOut } = useAuth();
  return (
    <nav>
      <div className="bg-purple-300">AuthToken: [{authToken}]</div>
      <Link to="/">Home</Link>
      <Link to="/testme" className="ml-2">
        TestMe
      </Link>
      <Link to="/authtest" className="ml-2">
        Auth Test
      </Link>
      <Link to="/private" className="ml-2 text-green-600">
        Private Page Test
      </Link>
      <Link to="/lobby" className="ml-2 text-purple-600">
        Lobby
      </Link>
      {!authToken && (
        <>
          <Link to="/login" className="ml-2">
            Log In
          </Link>
          <Link to="/signup" className="ml-2 ">
            Sign Up
          </Link>
        </>
      )}
      {authToken && (
        <span className="ml-2 link" onClick={() => logOut()}>
          Sign out
        </span>
      )}
    </nav>
  );
};
export default AppNav;
