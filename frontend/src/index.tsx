import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";

import "./index.css";

//import App from "./app/App";

// From https://redux-toolkit.js.org/tutorials/advanced-tutorial
const render = () => {
  const App = require("./app/App").default;

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
};

render();

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./app/App", render);
}

// Old
//ReactDOM.render(<App />, document.getElementById("root"));

// Concurrent Mode
// @ts-ignore
//ReactDOM.createRoot(document.getElementById("root")).render(<App />);
