import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Room from "../features/room/Room";
import {MessagesProvider} from '../contexts/MessagesContext';

type TParams = { slug: string };
interface Props extends RouteComponentProps<TParams> {}

export const RoomShow: React.FC<Props> = ({ match }) => {
  console.log('rendering roomshow')
  const {
    params: { slug },
  } = match;
  return(
    <MessagesProvider value={null}>
      <Room slug={slug} />
    </MessagesProvider>
  )
};
export default RoomShow;
