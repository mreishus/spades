
import React from "react";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";

export const CardMouseRegion = React.memo(({
    position,
    top,
    card,
    groupID,
    stackIndex,
    cardIndex,
    setMousePosition,
}) => {
    //const activeCard = useActiveCard();
    const setActiveCard = useSetActiveCard();

    const handleMouseOver = (event, mousePosition) => {
        console.log(mousePosition);
        //console.log(activeCard?.mousePosition);
        setMousePosition(mousePosition);
        setActiveCard({card: card, groupID: groupID, stackIndex: stackIndex, cardIndex: cardIndex, mousePosition: mousePosition});
        //console.log(activeCard?.mousePosition);
    }


    return(
        <div style={{
            position: 'absolute',
            top: top,
            width: '100%',
            height: '50%',
            //display: showButtons ? "none" : "block",
            //backgroundColor: 'red',
            //zIndex: -1,
        }}
            onMouseOver={event => handleMouseOver(event,position)}
        ></div>
    )
})