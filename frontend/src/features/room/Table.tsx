import React from "react";

interface Props {}

export const Table: React.FC<Props> = () => {
  const cardHeight = "h-24";

  return (
    <div className="h-full w-full relative">
      <div className="h-56 bg-orange-200 border rounded-lg">
        {/* Top row/card */}
        <div className="absolute inset-x-0 top-0 h-0 p-1 flex">
          <div className="mx-auto flex">
            <div className="w-20 px-2 text-right text-sm">Bid: 4 Tricks: 2</div>
            <img
              src={`/images/cards3/2c.png`}
              alt=".."
              className={cardHeight + " object-cover"}
            />
            <div className="w-20"></div>
          </div>
        </div>

        {/* Bottom row/card */}
        <div className="absolute inset-x-0 bottom-0 h-0 p-1 flex">
          <div className="mx-auto flex -mt-24 items-end">
            <div className="w-20"></div>
            <img
              src={`/images/cards3/8c.png`}
              alt=".."
              className={cardHeight + " object-cover"}
            />
            <div className="w-20 px-2 text-sm">
              Bid: 4
              <br />
              Tricks: 8
            </div>
          </div>
        </div>

        {/* Left row/card */}
        <div className="absolute inset-y-0 left-0 p-1 flex">
          <div className="my-auto flex flex-col">
            <div className="h-12"></div>
            <div className="h-24 ml-4">
              <img
                src={`/images/cards3/11c.png`}
                alt=".."
                className={cardHeight + " object-cover rotate-1/4"}
              />
            </div>
            <div className="h-12 text-sm -mt-4 mb-4">
              Bid: 4<br />
              Tricks: 0
            </div>
          </div>
        </div>

        {/* Right row/card */}
        <div className="absolute inset-y-0 right-0 p-1 flex">
          <div className="my-auto flex flex-col">
            <div className="h-12 mt-4 -mb-4 flex items-end">
              <div className="text-right w-full text-sm pb-1">
                Bid: 4<br />
                Tricks: 2
              </div>
            </div>
            <div className="h-24 mr-4">
              <img
                src={`/images/cards3/13c.png`}
                alt=".."
                className={cardHeight + " object-cover rotate-1/4"}
              />
            </div>
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Table;
