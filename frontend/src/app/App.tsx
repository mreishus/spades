import React, { useState } from "react";
import axios from "axios";

import SocketProvider from "../components/SocketProvider";
import AppRouter from "./AppRouter";
import AuthContext from "../contexts/AuthContext";

import "../css/tailwind.compiled.css";
import useBodyClass from "../hooks/useBodyClass";
import useHtmlClass from "../hooks/useHtmlClass";

import { BrowserRouter as Router } from "react-router-dom";

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
  const logOut = async () => {
    const res = await axios.delete("/be/api/v1/session", {
      headers: {
        Authorization: authToken
      }
    });
    if (res.status !== 200) {
      console.warn("unable to log out..");
    }
    setAuthToken(null);
    setRenewToken(null);
  };

  useHtmlClass(["text-gray-900", "antialiased"]);
  useBodyClass(["min-h-screen", "bg-gray-100"]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        renewToken,
        setRenewToken,
        logOut
      }}
    >
      <SocketProvider
        wsUrl={process.env.REACT_APP_WS_URL || "/be/socket"}
        options={{ hello: "hi", token: "whatever" }}
      >
        <Router>
          <AppRouter />
        </Router>
      </SocketProvider>
    </AuthContext.Provider>
  );
};

export default App;
