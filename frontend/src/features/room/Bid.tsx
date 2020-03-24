import React from "react";

interface Props {
  broadcast: (eventName: string, payload: object) => void;
}

const chunk = (arr: Array<any>, size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );

const translateBidNum = (num: "nil" | number): number => {
  if (num === "nil") {
    return 0;
  }
  return num;
};

export const Bid: React.FC<Props> = ({ broadcast }) => {
  const possibleBids = ["nil", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const chunkedBids = chunk(possibleBids, 8);
  return (
    <div className="bg-gray-100 rounded-lg border p-4">
      <div>How many tricks can you take?</div>
      {chunkedBids.map((theseBids) => (
        <div className="flex flex-wrap items-end justify-around  mt-2">
          {theseBids.map((bidNum) => (
            <button
              onClick={() =>
                broadcast("bid", { bidNum: translateBidNum(bidNum) })
              }
              className="px-2 py-1 rounded border hover:bg-blue-400 bg-blue-300 text-gray-800"
            >
              {bidNum}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Bid;
