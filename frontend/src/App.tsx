import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./tailwind.css";

const App: React.FC = () => {
  return (
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
      </header>
    </div>
  );
};

export default App;
