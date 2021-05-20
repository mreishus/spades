import React, { useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { Tokens } from './Tokens';
import { GROUPSINFO } from "./Constants";
import { CardMouseRegion } from "./CardMouseRegion"
import { useSetActiveCard } from "../../contexts/ActiveCardContext";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDisplayName, getCurrentFace, getVisibleFace, getVisibleFaceSRC, getVisibleSide } from "./Helpers";
import { Target } from "./Target";
import { useSetDropdownMenu } from "../../contexts/DropdownMenuContext";
import useLongPress from "../../hooks/useLongPress";

export const Card = React.memo(({
    cardId,
    groupId,
    groupType,
    gameBroadcast,
    chatBroadcast,
    playerN,
    cardIndex,
    cardSize,
    registerDivToArrowsContext
}) => {    
    const cardStore = state => state?.gameUi?.game?.cardById[cardId];
    const card = useSelector(cardStore);
    if (!card) return null;
    const currentFace = getCurrentFace(card);
    const visibleSide = getVisibleSide(card, playerN);
    const visibleFace = getVisibleFace(card, playerN);
    const zIndex = 1000 - cardIndex;
    console.log('Rendering Card ',visibleFace.name);
    const setActiveCard = useSetActiveCard();
    const setDropdownMenu = useSetDropdownMenu();
    const [isActive, setIsActive] = useState(false);
    const displayName = getDisplayName(card);

    const onLongPress = () => {
        console.log(card);
    };

    const handleClick = () => {
        const dropdownMenu = {
            type: "card",
            card: card,
            title: displayName,
            cardIndex: cardIndex,
            groupId: groupId,
        }
        setDropdownMenu(dropdownMenu);
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    
    //const longPress = useLongPress(onLongPress, onClick, defaultOptions);

    const handleMouseLeave = (_event) => {
        setIsActive(false);
        setActiveCard(null);
    }

    const arrowRelationList = () => {
        const relationList = [];
        for (var id of card.arrowIds) {
            const relation = {
                targetId: "archer-"+id,
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
            }
            relationList.push(relation);
        }
        return relationList;
    }

    return (
        <div id={card.id}>
            {/* <ContextMenuTrigger id={"context-"+card.id} holdToDisplay={500}> */}
                <div 
                // {...longPress}
                    className={isActive ? 'isActive' : ''}
                    key={card.id}
                    style={{
                        position: "absolute",
                        background: `url(${getVisibleFaceSRC(card,playerN)}) no-repeat scroll 0% 0% / contain`, //group.type === "deck" ? `url(${card.sides["B"].src}) no-repeat` : `url(${card.sides["A"].src}) no-repeat`,
                        height: `${cardSize*visibleFace.height}vw`,
                        width: `${cardSize*visibleFace.width}vw`,
                        left: `${0.2 + (1.39-visibleFace.width)*cardSize/2 + cardSize/3*cardIndex}vw`,
                        top: "50%",
                        borderRadius: '8px',
                        MozBoxShadow: isActive ? '0 0 7px yellow' : '',
                        WebkitBoxShadow: isActive ? '0 0 7px yellow' : '',
                        boxShadow: isActive ? '0 0 7px yellow' : '',
                        transform: `translate(0%,-50%) rotate(${card.rotation}deg)`,
                        zIndex: zIndex,
                        cursor: "default",
                        WebkitTransitionDuration: "0.1s",
                        MozTransitionDuration: "0.1s",
                        OTransitionDuration: "0.1s",
                        transitionDuration: "0.1s",
                        WebkitTransitionProperty: "-webkit-transform",
                        MozTransitionProperty: "-moz-transform",
                        OTransitionProperty: "-o-transform",
                        transitionProperty: "transform",
                    }}
                    onClick={handleClick}
                    onMouseLeave={event => handleMouseLeave(event)}
                >
                    {(card["peeking"][playerN] && groupType !== "hand" && (card["currentSide"] === "B")) ? <FontAwesomeIcon className="absolute bottom-0 text-2xl" icon={faEye}/>:null}
                    <Target
                        cardId={cardId}
                        cardSize={cardSize}
                    />
                    <Tokens
                        cardName={currentFace.name}
                        cardType={currentFace.type}
                        cardId={card.id}
                        isActive={isActive}
                        gameBroadcast={gameBroadcast}
                        chatBroadcast={chatBroadcast}
                        zIndex={zIndex}
                    />
                    <CardMouseRegion 
                        position={"top"}
                        top={"0%"}
                        card={card}
                        setIsActive={setIsActive}
                        zIndex={zIndex}
                    />
                    <CardMouseRegion 
                        position={"bottom"}
                        top={"50%"}
                        card={card}
                        setIsActive={setIsActive}
                        zIndex={zIndex}
                    />
                    <div 
                        ref={registerDivToArrowsContext ? (div) => registerDivToArrowsContext({ id: "arrow-"+card.id, div }) : null} 
                        style={{
                            position: "absolute",
                            width: "1px", 
                            height: "1px",
                            top: "50%",
                            left: "50%",
                        }}
                    />
                    {/* <ArcherElement
                        id={"archer-"+card.id}
                        relations={arrowRelationList()}
                    >
                        <div style={{
                            position: "absolute",
                            width: "15px", 
                            height: "15px",
                            backgroundColor: "red",
                            top: "70%",
                            left: "50%",
                        }}/>
                    </ArcherElement> */}
                </div>
        </div>
    )
})