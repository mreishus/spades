import React from "react";
import { useSelector } from "react-redux";
import useGameUIView from "../../hooks/useGameUIView";
import { RootState } from "../../rootReducer";

interface Props {
  isNorthSouth?: boolean;
  isEastWest?: boolean;
}

export const GameTeam: React.FC<Props> = ({ isNorthSouth, isEastWest }) => {
  const gameUIView = useGameUIView();
  const usersById = useSelector((state: RootState) => state.users.usersById);

  if (gameUIView == null) {
    return null;
  }
  const { seats } = gameUIView.game_ui;

  let name1;
  let name2;

  if (isNorthSouth) {
    const { north, south } = seats;
    let [northName, southName] = ["North", "South"];
    if (north.sitting != null && usersById[north.sitting] != null) {
      northName = usersById[north.sitting].alias;
    }
    if (south.sitting != null && usersById[south.sitting] != null) {
      southName = usersById[south.sitting].alias;
    }
    [name1, name2] = [northName, southName];
  } else if (isEastWest) {
    const { east, west } = seats;
    let [eastName, westName] = ["East", "West"];
    if (east.sitting != null && usersById[east.sitting] != null) {
      eastName = usersById[east.sitting].alias;
    }
    if (west.sitting != null && usersById[west.sitting] != null) {
      westName = usersById[west.sitting].alias;
    }
    [name1, name2] = [eastName, westName];
  } else {
    return null;
  }
  return (
    <span>
      {name1}/{name2}
    </span>
  );
};
export default GameTeam;
