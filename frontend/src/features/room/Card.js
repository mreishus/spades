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
    const isInMyHand = groupId === (playerN+"Hand");
    const zIndex = 1000 - cardIndex;
    console.log('Rendering Card ',visibleFace.name);
    const setActiveCard = useSetActiveCard();
    const setDropdownMenu = useSetDropdownMenu();
    const [isActive, setIsActive] = useState(false);
    const displayName = getDisplayName(card);

    // const onClick = (event) => {
    //     console.log("long press")
    //     const dropdownMenu = {
    //         card: card,
    //         x: event.clientX,
    //         y: event.clientY,
    //         cardIndex: cardIndex,
    //     }
    //     console.log(dropdownMenu)
    //     setDropdownMenu(dropdownMenu);
    // }

    const onLongPress = () => {
        console.log('longpress is triggered');
        const dropdownMenu = {
            card: card,
            cardIndex: cardIndex,
        }
        setDropdownMenu(dropdownMenu);
    };

    const onClick = () => {
        console.log('click is triggered')
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    
    const longPress = useLongPress(onLongPress, onClick, defaultOptions);

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

    const handleMenuClick = (_event, data) => {
        if (data.action === "detach") {
            gameBroadcast("game_action", {action: "detach", options: {card_id: card.id}})
            chatBroadcast("game_update", {message: "detached "+displayName+"."})
        } else if (data.action === "peek") {
            gameBroadcast("game_action", {action: "peek_card", options: {card_id: card.id, value: true}})
            chatBroadcast("game_update", {message: "peeked at "+displayName+"."})
        } else if (data.action === "unpeek") {
            gameBroadcast("game_action", {action: "peek_card", options: {card_id: card.id, value: false}})
            chatBroadcast("game_update", {message: " stopped peeking at "+displayName+"."})
        } else if (data.action === "move_card") {
            const destGroupTitle = GROUPSINFO[data.destGroupId].name;
            if (data.position === "t") {
                gameBroadcast("game_action", {action: "move_card", options: {card_id: card.id, dest_group_id: data.destGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                chatBroadcast("game_update",{message: "moved "+displayName+" to top of "+destGroupTitle+"."})
            } else if (data.position === "b") {
                gameBroadcast("game_action", {action: "move_card", options: {card_id: card.id, dest_group_id: data.destGroupId, dest_stack_index: -1, dest_card_index: 0, combine: false, preserve_state: false}})
                chatBroadcast("game_update", {message: "moved "+displayName+" to bottom of "+destGroupTitle+"."})
            } else if (data.position === "s") {
                gameBroadcast("game_action", {action: "move_card", options: {card_id: card.id, dest_group_id: data.destGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: data.destGroupId}})
                chatBroadcast("game_update", {message: "shuffled "+displayName+" into "+destGroupTitle+"."})
            }
        } else if (data.action === "update_tokens_per_round") {
            const increment = data.increment;
            const tokenType = data.tokenType;
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "cardById", card.id, "tokensPerRound", tokenType, increment]]}})
            chatBroadcast("game_update",{message: "added "+increment+" "+tokenType+" per round to "+displayName+"."})
        }
    }

    return (
        <div id={card.id}>
            {/* <ContextMenuTrigger id={"context-"+card.id} holdToDisplay={500}> */}
                <div {...longPress}
                    className={isActive ? 'isActive' : ''}
                    key={card.id}
                    style={{
                        position: "absolute",
                        background: `url(${getVisibleFaceSRC(card,playerN)}) no-repeat scroll 0% 0% / contain`, //group.type === "deck" ? `url(${card.sides["B"].src}) no-repeat` : `url(${card.sides["A"].src}) no-repeat`,
                        height: `${cardSize*visibleFace.height}vw`,
                        width: `${cardSize*visibleFace.width}vw`,
                        left: `${0.2 + (1.39-visibleFace.width)*cardSize/2 + cardSize/3*cardIndex}vw`,
                        top: "50%",
                        borderRadius: '6px',
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
                    //onClick={onClick}
                    onMouseLeave={event => handleMouseLeave(event)}
                >
                    {(card["peeking"][playerN] && !isInMyHand && (card["currentSide"] === "B")) ? <FontAwesomeIcon className="absolute bottom-0 text-2xl" icon={faEye}/>:null}
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
            {/* </ContextMenuTrigger>

            <ContextMenu id={"context-"+card.id} style={{zIndex:1e8}}>
                <hr></hr>
                {cardIndex>0 ? <MenuItem onClick={handleMenuClick} data={{action: 'detach'}}>Detach</MenuItem>:null}
                {visibleSide === "B"? <MenuItem onClick={handleMenuClick} data={{action: 'peek'}}>Peek</MenuItem>:null}
                {card["peeking"][playerN] ? <MenuItem onClick={handleMenuClick} data={{action: 'unpeek'}}>Stop peeking</MenuItem>:null}
                <SubMenu title='Move to'>
                    <SubMenu title='Encounter Deck'>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupId: "sharedEncounterDeck", position: "t"}}>Top</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupId: "sharedEncounterDeck", position: "b"}}>Bottom</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupId: "sharedEncounterDeck", position: "s"}}>Shuffle in (h)</MenuItem>
                    </SubMenu>
                    <SubMenu title="Owner's Deck">
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupId: card.owner+"Deck", position: "t"}}>Top</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupId: card.owner+"Deck", position: "b"}}>Bottom</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupId: card.owner+"Deck", position: "s"}}>Shuffle in (h)</MenuItem>
                    </SubMenu>
                    <MenuItem onClick={handleMenuClick} data={{ action: 'move_card', destGroupId: "sharedVictory", position: "t" }}>Victory Display</MenuItem>
                </SubMenu>
                <SubMenu title='Per round'>
                    {["Resource", "Progress", "Damage"].map((tokenType, _tokenIndex) => (
                    <SubMenu title={tokenType}>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment: -5}}>-5 {card.tokensPerRound[tokenType.toLowerCase()]==-5 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment: -4}}>-4 {card.tokensPerRound[tokenType.toLowerCase()]==-4 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment: -3}}>-3 {card.tokensPerRound[tokenType.toLowerCase()]==-3 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment: -2}}>-2 {card.tokensPerRound[tokenType.toLowerCase()]==-2 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment: -1}}>-1 {card.tokensPerRound[tokenType.toLowerCase()]==-1 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment:  0}}>0 {card.tokensPerRound[tokenType.toLowerCase()]==0 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment:  1}}>+1 {card.tokensPerRound[tokenType.toLowerCase()]==1 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment:  2}}>+2 {card.tokensPerRound[tokenType.toLowerCase()]==2 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment:  3}}>+3 {card.tokensPerRound[tokenType.toLowerCase()]==3 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment:  4}}>+4 {card.tokensPerRound[tokenType.toLowerCase()]==4 ? "✓" : ""}</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'update_tokens_per_round', tokenType: tokenType.toLowerCase(), increment:  5}}>+5 {card.tokensPerRound[tokenType.toLowerCase()]==5 ? "✓" : ""}</MenuItem>
                    </SubMenu>
                ))}
                </SubMenu>
            </ContextMenu> */}
        </div>
    )
})