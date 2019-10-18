import React from "react";
import "../css/tailwind.compiled.css";
import useBodyClass from "../hooks/useBodyClass";
import useHtmlClass from "../hooks/useHtmlClass";

import SocketProvider from "../components/SocketProvider";
import AppRouter from "./AppRouter";

import { BrowserRouter as Router, Link } from "react-router-dom";

const App: React.FC = () => {
  useHtmlClass(["text-gray-900", "antialiased"]);
  useBodyClass(["min-h-screen", "bg-gray-100"]);
  return (
    <SocketProvider
      wsUrl={process.env.REACT_APP_WS_URL || "/be/socket"}
      options={{ hello: "hi", token: "whatever" }}
    >
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about" className="ml-2">
            About
          </Link>
          <Link to="/users" className="ml-2">
            Users
          </Link>
          <Link to="/testme" className="ml-2">
            TestMe
          </Link>
          <Link to="/lobby" className="ml-2 text-purple-600">
            Lobby
          </Link>
        </nav>
        <AppRouter />
      </Router>
    </SocketProvider>
  );
};

export default App;
