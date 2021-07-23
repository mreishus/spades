
import React from "react";
import { useSetActiveCard } from "../../contexts/ActiveCardContext";
import { useTouchAction } from "../../contexts/TouchActionContext";
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
    const touchAction = useTouchAction();
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
        setIsActive(true);
    }

    const handleDoubleClick = () => {
        console.log("touch doubleclick");
        handleSetDropDownMenu();
    }

    const handleSetDropDownMenu = () => {
        const dropdownMenu = {
            type: "card",
            card: card,
            title: displayName,
            cardIndex: cardIndex,
            groupId: groupId,
            groupType: groupType,
        }
        if (playerN) setDropdownMenu(dropdownMenu);
    }

    const handleClick = (event,position) => {
        setDropdownMenu(null);
        // If touch mode is not enabled, we just open the menu
        if (!touchMode) {
            handleSetDropDownMenu();
            return;
        }
        // If touch mode is enabled we check if there is a current action
        if (touchAction) {
            // Perform the touch action
            if (touchAction.action === "increment_token") {
                const options = touchAction.options;
                const tokenType = processTokenType(options.tokenType, card);
                gameBroadcast("game_action", {action:"increment_token", options: {card_id: card.id, token_type: tokenType, increment: options.increment}});
                if (options.increment === 1) chatBroadcast("game_update",{message: "added "+options.increment+" "+tokenPrintName(options.tokenType)+" token to "+displayName+"."});
                else if (options.increment === -1) chatBroadcast("game_update",{message: "removed "+(-options.increment)+" "+tokenPrintName(options.tokenType)+" token to "+displayName+"."});
            }
        } else {
            // No touch action, so we make it the active card (since there was no mouseover)
            makeActive(event,position);
            // Then we check for tap vs. double tap
            console.log("touch click") //, touchMode, touchAction)
            if (clickTimeout && !touchAction) handleDoubleClick();
            else {
                //recentClick = true; 
                if (clickTimeout) clearTimeout(clickTimeout);
                clickTimeout = setTimeout(function() {
                    clickTimeout = null;
                }, 500);
            }
        }
    }

    return(
        <div 
            className="bg-red-200"
            style={{
                position: 'absolute',
                top: top,
                width: '100%',
                height: '50%',
                zIndex: zIndex,
                opacity: "50%"
            }}
            onMouseOver={event => makeActive(event,position)}
            onClick={event => handleClick(event,position)}
        />
    )
})