import React from "react";
import { Redirect } from "react-router";
/* import Container from "../components/basic/Container"; */
/* import Card from "../components/basic/Card"; */

interface Props {}

export const Home: React.FC<Props> = () => {
  return <Redirect to="/lobby" />;
  /* return ( */
  /*   <Container> */
  /*     <Card className="mt-20 p-4 bg-gray-100 rounded-lg shadow-lg"> */
  /*       <div className="text-lg my-2"> */
  /*         StarSpades is still WIP, and not available. The current goal is to */
  /*         have a minimally playable version ready on Nov 13, 2019. */
  /*       </div> */
  /*       <div>Last update: 2019-11-04.</div> */
  /*     </Card> */
  /*   </Container> */
  /* ); */
};
export default Home;
