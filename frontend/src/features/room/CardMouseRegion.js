
import React from "react";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";

export const CardMouseRegion = React.memo(({
    position,
    top,
    card,
    groupID,
    stackIndex,
    cardIndex,
    setCard
}) => {
    //const activeCard = useActiveCard();
    const setActiveCard = useSetActiveCard();

    const handleMouseOver = (event, mousePosition) => {
        const screenPosition = event.clientX > (window.innerWidth/2) ? "right" : "left";
        setActiveCard({
            card: card, 
            groupID: groupID, 
            stackIndex: stackIndex, 
            cardIndex: cardIndex, 
            mousePosition: mousePosition, 
            screenPosition: screenPosition,
            setCard: setCard,
        });
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