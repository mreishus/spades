
import React from "react";
import { useSetActiveCard } from "../../contexts/ActiveCardContext";
import { useSetTouchAction, useTouchAction } from "../../contexts/TouchActionContext";
import { useTouchMode } from "../../contexts/TouchModeContext";
import { getDisplayName, processTokenType, tokenPrintName } from "./Helpers";
import { useSetDropdownMenu } from "../../contexts/DropdownMenuContext";
import { gameAction } from "./Actions";
import useLongPress from "../../hooks/useLongPress";

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
            visible: true,
        }
        if (playerN) setDropdownMenu(dropdownMenu);
    }

    const handleClick = (event) => {
        event.stopPropagation();
        //setDropdownMenu(null);
        // Open the menu
        if (!touchMode) handleSetDropDownMenu();
        // Make the card active (since there was no mouseover)
        // The listener in HandleTouchButton will see the active card change and perform the touch action
        makeActive(event,position);
    }

    const onLongPress = (event) => {
        event.preventDefault();
        handleSetDropDownMenu();
    };

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };

    const longPress = useLongPress(onLongPress, handleClick, defaultOptions);
    const regionStyle = {
        position: 'absolute',
        top: top,
        width: '100%',
        height: '50%',
        zIndex: zIndex,
    }

    if (touchMode) {
        return(
            <div 
                {...longPress}
                style={regionStyle}
                onMouseOver={event => !touchMode && makeActive(event,position)}
            />
    )} else return (
            <div 
                style={regionStyle}
                onMouseOver={event => !touchMode && makeActive(event,position)}
                onClick={event => handleClick(event,position)}
            />
            // onMouseUp={event => !touchMode && handleClick(event,position)}
            // onTouchStart={event => handleClick(event,position)}      
    )
})