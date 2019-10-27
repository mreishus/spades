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
        <div className="absolute inset-x-0 top-0 h-0 bg-gray-700">
          <img
            src={`/images/cards3/2c.png`}
            alt=".."
            className={cardHeight + " object-cover mx-auto"}
          />
        </div>

        {/* Bottom row/card */}
        <div className="absolute inset-x-0 bottom-0 h-0 bg-gray-700 flex">
          <img
            src={`/images/cards3/8c.png`}
            alt=".."
            className={cardHeight + " -mt-24 object-cover mx-auto "}
          />
        </div>

        {/* Left row/card */}
        <div className="absolute inset-y-0 left-0 flex">
          <img
            src={`/images/cards3/11c.png`}
            alt=".."
            className={cardHeight + " object-cover ml-4 my-auto rotate-1/4"}
          />
        </div>

        {/* Right row/card */}
        <div className="absolute inset-y-0 right-0 flex">
          <img
            src={`/images/cards3/13c.png`}
            alt=".."
            className={cardHeight + " object-cover mr-4 my-auto rotate-1/4"}
          />
        </div>
      </div>
    </div>
  );
};
export default Table;
