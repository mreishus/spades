import React from "react";
import cx from "classnames";

interface Props {
}

export const ScoreTable: React.FC<Props> = ({  }) => {

  let numRounds = 3;
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
            </td>
            <td className={"text-right p-1 font-semibold"}>
            </td>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  );
};
export default ScoreTable;


