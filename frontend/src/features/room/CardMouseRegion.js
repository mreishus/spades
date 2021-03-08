
import React from "react";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";

export const CardMouseRegion = React.memo(({
    position,
    top,
    cardId,
    setIsActive
}) => {
    //const activeCard = useActiveCard();
    const setActiveCard = useSetActiveCard();

    const handleMouseOver = (event, mousePosition) => {
        const screenPosition = event.clientX > (window.innerWidth/2) ? "right" : "left";
        setActiveCard({
            cardId: cardId,
            mousePosition: mousePosition, 
            screenPosition: screenPosition,
        });
        setIsActive(true);
    }


    return(
        <div style={{
            position: 'absolute',
            top: top,
            width: '100%',
            height: '50%',
        }}
            onMouseOver={event => handleMouseOver(event,position)}
        ></div>
    )
})