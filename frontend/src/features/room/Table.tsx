import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {}

export const Table: React.FC<Props> = () => {
  const cardHeight = "h-24";

  return (
    <div className="h-full w-full relative">
      <div className="h-56 bg-orange-200 border rounded-lg">
        {/* Top row/card */}
        <div className="absolute inset-x-0 top-0 h-0 p-1">
          <img
            src={`/images/cards3/2c.png`}
            alt=".."
            className={cardHeight + " object-cover mx-auto"}
          />
        </div>

        {/* Bottom row/card */}
        <div className="absolute inset-x-0 bottom-0 h-0 p-1 flex">
          <div className="mx-auto flex -mt-24 items-end">
            <div className="w-16"></div>
            <img
              src={`/images/cards3/8c.png`}
              alt=".."
              className={cardHeight + " object-cover"}
            />
            <div className="w-16 px-2">Bid: 4</div>
          </div>
        </div>

        {/* Left row/card */}
        <div className="absolute inset-y-0 left-0 p-1 flex">
          <div className="my-auto">
            <img
              src={`/images/cards3/11c.png`}
              alt=".."
              className={cardHeight + " object-cover ml-4 my-auto rotate-1/4"}
            />
            <div className="h-4 -mb-4">Bid: 4</div>
          </div>
        </div>

        {/* Right row/card */}
        <div className="absolute inset-y-0 right-0 p-1 flex">
          <div className="my-auto">
            <div className="h-6 -mt-6 align-bottom align-text-bottom text-right">
              Bid: 4
            </div>
            <img
              src={`/images/cards3/13c.png`}
              alt=".."
              className={cardHeight + " object-cover mr-4 my-auto rotate-1/4"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Table;
