import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";
import Container from "../components/basic/Container";
import Card from "../components/basic/Card";

interface Props {}

export const Home: React.FC<Props> = () => {
  return (
    <Container>
      <Card className="mt-20 p-4 bg-gray-100 rounded-lg shadow-lg">
        <div className="text-lg my-2">
          StarSpades is in rapid progress. Keep an eye on this space.
        </div>
        <div>Happy halloween!</div>
        <div>Last update: 2019-10-24.</div>
      </Card>
    </Container>
  );
};
export default Home;
