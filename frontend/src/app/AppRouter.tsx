import React from "react";
import { Switch, Route } from "react-router-dom";
import TestMe from "../components/TestMe";
import Lobby from "../features/lobby/Lobby";

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <Route path="/testme">
        <TestMe />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/users">
        <Users />
      </Route>
      <Route path="/lobby">
        <Lobby />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};
export default AppRouter;
