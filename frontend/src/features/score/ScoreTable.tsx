import React from "react";
import cx from "classnames";
import GameTeam from "../room/GameTeam";
import { GameScore, GameScoreRoundTeam } from "elixir-backend";

interface Props {
  score: GameScore;
}

export const ScoreTable: React.FC<Props> = ({ score }) => {
  if (score.east_west_rounds.length !== score.north_south_rounds.length) {
    return (
      <div>Error, the teams have a different amounts of rounds scored..</div>
    );
  }
  let numRounds = score.east_west_rounds.length;
  if (numRounds === 0) {
    return <div className="my-4">No scored rounds yet.</div>;
  }
  return (
    <div className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
      <table className="mt-2 mb-4">
        <thead>
          <tr className={""}>
            <td></td>
            <td className={"text-right p-1 font-semibold"}>
              <GameTeam isNorthSouth />
            </td>
            <td className={"text-right p-1 font-semibold"}>
              <GameTeam isEastWest />
            </td>
          </tr>
        </thead>
        <tbody>
          {[...Array(numRounds)].map((_, i) => (
            <ScoreTableRound
              key={i}
              team1={score.north_south_rounds[i]}
              team2={score.east_west_rounds[i]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ScoreTable;

interface PropsRound {
  team1: GameScoreRoundTeam;
  team2: GameScoreRoundTeam;
}
export const ScoreTableRound: React.FC<PropsRound> = ({ team1, team2 }) => {
  const showAdjBags = team1.adj_bags > 0 || team2.adj_bags > 0;
  const showBagPenalty = team1.bag_penalty < 0 || team2.bag_penalty < 0;
  const showNilRow =
    team1.adj_successful_nil !== 0 ||
    team1.adj_failed_nil !== 0 ||
    team2.adj_successful_nil !== 0 ||
    team2.adj_failed_nil !== 0;

  const rowClass = ["text-right text-gray-700"];
  const cellClass = ["p-1 text-sm"];
  const firstCellClass = cellClass.concat(["text-left"]);

  return (
    <>
      <tr className={cx(rowClass)}>
        <td className={cx(firstCellClass)}>Tricks Won/Bid:</td>
        <td className={cx(cellClass)}>
          {team1.won}/{team1.bid}
        </td>
        <td className={cx(cellClass)}>
          {team2.won}/{team2.bid}
        </td>
      </tr>

      <tr className={cx(rowClass)}>
        <td className={cx(firstCellClass)}>Bid Score:</td>
        <td className={cx(cellClass)}>
          {team1.adj_successful_bid !== 0 && (
            <span className="text-green-800">+{team1.adj_successful_bid}</span>
          )}
          {team1.adj_failed_bid !== 0 && (
            <span className="text-red-800">{team1.adj_failed_bid}</span>
          )}
        </td>
        <td className={cx(cellClass)}>
          {team2.adj_successful_bid !== 0 && (
            <span className="text-green-800">+{team2.adj_successful_bid}</span>
          )}
          {team2.adj_failed_bid !== 0 && (
            <span className="text-red-800">{team2.adj_failed_bid}</span>
          )}
        </td>
      </tr>

      {showNilRow && (
        <tr className={cx(rowClass)}>
          <td className={cx(firstCellClass)}>Nil Score:</td>
          <td className={cx(cellClass)}>
            {team1.adj_successful_nil !== 0 && (
              <span className="text-green-800">
                +{team1.adj_successful_nil}
              </span>
            )}
            {team1.adj_failed_nil !== 0 && (
              <span className="text-red-800">{team1.adj_failed_nil}</span>
            )}
          </td>
          <td className={cx(cellClass)}>
            {team2.adj_successful_nil !== 0 && (
              <span className="text-green-800">
                +{team2.adj_successful_nil}
              </span>
            )}
            {team2.adj_failed_nil !== 0 && (
              <span className="text-red-800">{team2.adj_failed_nil}</span>
            )}
          </td>
        </tr>
      )}

      {showAdjBags && (
        <tr className={cx(rowClass)}>
          <td className={cx(firstCellClass)}>Bags:</td>
          <td className={cx(cellClass)}>+{team1.adj_bags}</td>
          <td className={cx(cellClass)}>+{team2.adj_bags}</td>
        </tr>
      )}
      {showBagPenalty && (
        <tr className={cx(rowClass)}>
          <td className={cx(firstCellClass)}>Bag Penalty:</td>
          <td className={cx(cellClass, "text-red-800")}>{team1.bag_penalty}</td>
          <td className={cx(cellClass, "text-red-800")}>{team2.bag_penalty}</td>
        </tr>
      )}
      <tr
        className={cx(
          rowClass.concat(["bg-gray-200 text-blue-900 font-semibold text-base"])
        )}
      >
        <td className={cx(firstCellClass)}>Total Score:</td>
        <td className={cx(cellClass)}>{team1.after_score}</td>
        <td className={cx(cellClass)}>{team2.after_score}</td>
      </tr>
    </>
  );
};
