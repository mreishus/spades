import React from "react";
import { useSelector, useDispatch } from 'react-redux';

export const Target = React.memo(({
    cardId,
    cardSize,
}) => {
    const targetingStore = state => state?.gameUi?.game?.cardById[cardId]?.targeting;
    const targeting = useSelector(targetingStore);
    if (!targeting) return null;
    var targetString = "";
    if (targeting.player1) targetString += "1";
    if (targeting.player2) targetString += "2";
    if (targeting.player3) targetString += "3";
    if (targeting.player4) targetString += "4";
    if (targetString === "") return null;

    return (
        <div className="absolute"
            style={{
                width: `${cardSize}vw`,
                height: `${cardSize}vw`,
                opacity: "60%",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <div className="absolute text-2xl font-black"
                style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                {targetString}
            </div>
            <img 
                className="absolute h-full w-full"
                style={{
                    animation: "spin 3s infinite linear",
                }}
                src={process.env.PUBLIC_URL + '/images/other/target.png'}
            />
        </div>
    )
})