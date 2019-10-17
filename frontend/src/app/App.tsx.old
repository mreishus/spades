import React from "react";
import "../css/tailwind.compiled.css";
import useBodyClass from "../hooks/useBodyClass";
import useHtmlClass from "../hooks/useHtmlClass";

import SocketProvider from "../components/SocketProvider";
import TestMe from "../components/TestMe";

const App: React.FC = () => {
  useHtmlClass(["text-gray-900", "antialiased"]);
  useBodyClass(["min-h-screen", "bg-gray-100"]);
  return (
    <SocketProvider
      wsUrl={process.env.REACT_APP_WS_URL || "/be/socket"}
      options={{ hello: "hi", token: "whatever" }}
    >
      <div className="App">
        <header className="App-header">
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
          <h1>H1 test</h1>
          <h2>H2 test</h2>
          <h3>H3 test</h3>
          <a href="//google.com">Google.com</a>
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
