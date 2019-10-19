import React from "react";
import { Switch, Route } from "react-router-dom";
import TestMe from "../components/TestMe";
import RoomShow from "../pages/RoomShow";
import LobbyIndex from "../pages/LobbyIndex";
import Home from "../pages/Home";

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <Route path="/testme">
        <TestMe />
      </Route>

      <Route path="/room/:slug" component={RoomShow} />
      <Route path="/lobby" component={LobbyIndex} />
      <Route path="/" component={Home} />
    </Switch>
  );
};
export default AppRouter;
