import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./tailwind.css";

import SocketProvider from "./components/SocketProvider";
import TestMe from "./components/TestMe";

const App: React.FC = () => {
  return (
    <SocketProvider
      wsUrl={process.env.REACT_APP_WS_URL || "/be/socket"}
      options={{ hello: "hi", token: "whatever" }}
    >
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div className="border mt-2 shadow p-4 bg-red-800">Test</div>
          <div className="alert alert-danger mt-1">alert</div>
          <div className="alert alert-info mt-1">info</div>
          <TestMe />
        </header>
      </div>
    </SocketProvider>
  );
};

export default App;
