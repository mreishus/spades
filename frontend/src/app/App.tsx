import React, { useState } from "react";

import SocketProvider from "../components/SocketProvider";
import AppRouter from "./AppRouter";
import AuthContext from "../contexts/AuthContext";

import "../css/tailwind.compiled.css";
import useBodyClass from "../hooks/useBodyClass";
import useHtmlClass from "../hooks/useHtmlClass";

import { BrowserRouter as Router, Link } from "react-router-dom";

const App: React.FC = () => {
  const [authToken, priv_setAuthToken] = useState();
  const [renewToken, priv_setRenewToken] = useState();
  const setAuthToken = (data: any) => {
    localStorage.setItem("authToken", JSON.stringify(data));
    priv_setAuthToken(data);
  };
  const setRenewToken = (data: any) => {
    localStorage.setItem("renewToken", JSON.stringify(data));
    priv_setRenewToken(data);
  };

  useHtmlClass(["text-gray-900", "antialiased"]);
  useBodyClass(["min-h-screen", "bg-gray-100"]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        renewToken,
        setRenewToken
      }}
    >
      <SocketProvider
        wsUrl={process.env.REACT_APP_WS_URL || "/be/socket"}
        options={{ hello: "hi", token: "whatever" }}
      >
        <Router>
          <nav>
            <div className="bg-purple-300">AuthToken: [{authToken}]</div>
            <Link to="/">Home</Link>
            <Link to="/testme" className="ml-2">
              TestMe
            </Link>
            <Link to="/private" className="ml-2 text-green-600">
              Private Page Test
            </Link>
            <Link to="/lobby" className="ml-2 text-purple-600">
              Lobby
            </Link>
            <Link to="/login" className="ml-2">
              Log In
            </Link>
            <Link to="/signup" className="ml-2 ">
              Sign Up
            </Link>
          </nav>
          <AppRouter />
        </Router>
      </SocketProvider>
    </AuthContext.Provider>
  );
};

export default App;
