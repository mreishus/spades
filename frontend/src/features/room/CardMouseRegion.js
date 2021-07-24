
import React from "react";
import { useSetActiveCard } from "../../contexts/ActiveCardContext";
import { useSetTouchAction, useTouchAction } from "../../contexts/TouchActionContext";
import { useTouchMode } from "../../contexts/TouchModeContext";
import { getDisplayName, processTokenType, tokenPrintName } from "./Helpers";
import { useSetDropdownMenu } from "../../contexts/DropdownMenuContext";

var clickTimeout;

export const CardMouseRegion = React.memo(({
    position,
    top,
    card,
    setIsActive,
    zIndex,
    cardIndex,
    groupId,
    groupType,
    playerN,
    gameBroadcast,
    chatBroadcast,
}) => {
    const setActiveCard = useSetActiveCard();
    const setTouchAction = useSetTouchAction();
    const touchMode = useTouchMode();
    const displayName = getDisplayName(card);
    const setDropdownMenu = useSetDropdownMenu();

    const makeActive = (event, mousePosition) => {
        const screenPosition = event.clientX > (window.innerWidth/2) ? "right" : "left";
        setActiveCard({
            card: card,
            mousePosition: mousePosition, 
            screenPosition: screenPosition,
        });
        if (!touchMode) setIsActive(true);
    }

    const handleSetDropDownMenu = () => {
        const dropdownMenu = {
            type: "card",
            card: card,
            title: displayName,
            cardIndex: cardIndex,
            groupId: groupId,
            groupType: groupType,
            visible: (touchMode ? false : true),
        }
        if (playerN) setDropdownMenu(dropdownMenu);
    }

    const handleClick = (event,position) => {
        //setDropdownMenu(null);
        // Open the menu
        handleSetDropDownMenu();
        // Make the card active (since there was no mouseover)
        // The listener in HandleTouchButton will see the active card change and perform the touch action
        makeActive(event,position);
    }

    return(
        <div 
            style={{
                position: 'absolute',
                top: top,
                width: '100%',
                height: '50%',
                zIndex: zIndex,
            }}
            onMouseOver={event => !touchMode && makeActive(event,position)}
            onMouseUp={event => handleClick(event,position)}
            onTouchStart={event => handleClick(event,position)}
        />
    )
})