import React, { useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { Tokens } from './Tokens';
import { GROUPSINFO } from "./Constants";
import useProfile from "../../hooks/useProfile";
import { CardMouseRegion } from "./CardMouseRegion";
import { CardTapRegion } from "./CardTapRegion";
import { useSetActiveCard } from "../../contexts/ActiveCardContext";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDisplayName, getCurrentFace, getVisibleFace, getVisibleFaceSRC, getVisibleSide, getDefault } from "./Helpers";
import { Target } from "./Target";
import { useSetDropdownMenu } from "../../contexts/DropdownMenuContext";
import useLongPress from "../../hooks/useLongPress";
import { useTouchMode } from "../../contexts/TouchModeContext";
import { useTouchAction } from "../../contexts/TouchActionContext";

var clickTimeout;

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
    const user = useProfile();
    const cardStore = state => state?.gameUi?.game?.cardById[cardId];
    const card = useSelector(cardStore);
    if (!card) return null;
    const currentFace = getCurrentFace(card);
    const visibleFace = getVisibleFace(card, playerN);
    const zIndex = 1000 - cardIndex;
    console.log('Rendering Card ',visibleFace.name);
    const setActiveCard = useSetActiveCard();
    const [isActive, setIsActive] = useState(false);
    const touchMode = useTouchMode();
    const touchModeSpacingFactor = touchMode ? 1.5 : 1;

    const handleMouseLeave = (_event) => {
        setIsActive(false);
        setActiveCard(null);
    }

    return (
        <div id={card.id}>
                <div 
                    className={isActive ? 'isActive' : ''}
                    key={card.id}
                    style={{
                        position: "absolute",
                        background: `url(${getVisibleFaceSRC(card, playerN, user)}) no-repeat scroll 0% 0% / contain`, //group.type === "deck" ? `url(${card.sides["B"].src}) no-repeat` : `url(${card.sides["A"].src}) no-repeat`,
                        height: `${cardSize*visibleFace.height}vw`,
                        width: `${cardSize*visibleFace.width}vw`,
                        left: `${0.2 + (1.39-visibleFace.width)*cardSize/2 + cardSize*touchModeSpacingFactor/3*cardIndex}vw`,
                        top: "50%",
                        borderRadius: '8px',
                        MozBoxShadow: isActive ? '0 0 7px yellow' : '',
                        WebkitBoxShadow: isActive ? '0 0 7px yellow' : '',
                        boxShadow: isActive ? '0 0 7px yellow' : '',
                        transform: `translate(0%, ${groupType === "vertical" ? "0%" : "-50%"}) rotate(${card.rotation}deg)`,
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
                    onMouseLeave={event => !touchMode && handleMouseLeave(event)}
                    //onClick={handleClick}
                    // onDoubleClick={handleDoubleClick}
                    //onTouchStart={handleClick}
                >
                    {isActive && touchMode && 
                        <div 
                            className={"absolute w-full pointer-events-none bg-green-700 font-black rounded text-white text-sm text-center" + (card.rotation === -30 ? " bottom-0" : "")}
                            style={{height:"40px", opacity: "80%"}}>
                                <div>Tap again to</div>
                                {getDefault(card, groupId, groupType, cardIndex).title}
                        </div>}
                    {(card["peeking"][playerN] && groupType !== "hand" && (card["currentSide"] === "B")) ? <FontAwesomeIcon className="absolute top-0 right-0 text-2xl" icon={faEye}/>:null}
                    <Target
                        cardId={cardId}
                        cardSize={cardSize}
                    />
                    <CardMouseRegion 
                        position={"top"}
                        top={"0%"}
                        card={card}
                        setIsActive={setIsActive}
                        zIndex={zIndex}
                        cardIndex={cardIndex}
                        groupId={groupId}
                        groupType={groupType}
                        playerN={playerN}
                        gameBroadcast={gameBroadcast}
                        chatBroadcast={chatBroadcast}
                    />
                    <CardMouseRegion 
                        position={"bottom"}
                        top={"50%"}
                        card={card}
                        setIsActive={setIsActive}
                        zIndex={zIndex}
                        cardIndex={cardIndex}
                        groupId={groupId}
                        groupType={groupType}
                        playerN={playerN}
                        gameBroadcast={gameBroadcast}
                        chatBroadcast={chatBroadcast}
                    />
                    {/* <CardTapRegion 
                        card={card}
                        playerN={playerN}
                        setIsActive={setIsActive}
                        zIndex={zIndex}
                        cardIndex={cardIndex}
                        groupId={groupId}
                        groupType={groupType}
                        gameBroadcast={gameBroadcast}
                        chatBroadcast={chatBroadcast}
                    /> */}
                    <Tokens
                        cardName={currentFace.name}
                        cardId={card.id}
                        isActive={isActive}
                        gameBroadcast={gameBroadcast}
                        chatBroadcast={chatBroadcast}
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