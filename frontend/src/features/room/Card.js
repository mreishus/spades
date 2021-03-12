import React, { useState, useEffect, useRef, Component } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Tokens } from './Tokens';
import { playerBackSRC, encounterBackSRC } from "./Constants"
import { getCardFaceSRC } from "./CardBack"
import { CARDSCALE, GROUPSINFO } from "./Constants"
import styled from "@emotion/styled";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import { CardMouseRegion } from "./CardMouseRegion"
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDisplayName, getCurrentFace, getVisibleFaceSRC } from "./Helpers";
import { setGame } from "./gameUiSlice"

// PREVENT DOUBLECLICK REGISTERING 2 CLICK EVENTS
export const delay = n => new Promise(resolve => setTimeout(resolve, n));

export const cancellablePromise = promise => {
    let isCanceled = false;
  
    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then(
        value => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
        error => reject({ isCanceled, error }),
      );
    });
  
    return {
      promise: wrappedPromise,
      cancel: () => (isCanceled = true),
    };
};

const useCancellablePromises = () => {
  const pendingPromises = useRef([]);

  const appendPendingPromise = promise =>
    pendingPromises.current = [...pendingPromises.current, promise];

  const removePendingPromise = promise =>
    pendingPromises.current = pendingPromises.current.filter(p => p !== promise);

  const clearPendingPromises = () => pendingPromises.current.map(p => p.cancel());

  const api = {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  };

  return api;
};

const useClickPreventionOnDoubleClick = (onClick, onDoubleClick) => {
    const api = useCancellablePromises();
  
    const handleClick = () => {
      api.clearPendingPromises();
      const waitForClick = cancellablePromise(delay(300));
      api.appendPendingPromise(waitForClick);
  
      return waitForClick.promise
        .then(() => {
          api.removePendingPromise(waitForClick);
          onClick();
        })
        .catch(errorInfo => {
          api.removePendingPromise(waitForClick);
          if (!errorInfo.isCanceled) {
            throw errorInfo.error;
          }
        });
    };
  
    const handleDoubleClick = () => {
      api.clearPendingPromises();
      onDoubleClick();
    };
  
    return [handleClick, handleDoubleClick];
};
// END PREVENT DOUBLECLICK REGISTERING 2 CLICK EVENTS



    // const storeCard = state => state.game.cardById[inputCard.id];
    // const dispatch = useDispatch();
    // const hello = useSelector(storeCard);

export const Card = React.memo(({
    cardId,
    gameBroadcast,
    chatBroadcast,
    playerN,
    cardIndex,
}) => {
    const cardStore = state => state?.gameUi?.game?.cardById[cardId];
    const card = useSelector(cardStore);
    const exhaustedStore = state => state?.gameUi?.game?.cardById[cardId].exhausted;
    const exhausted = useSelector(exhaustedStore);
    const rotationStore = state => state?.gameUi?.game?.cardById[cardId].rotation;
    const rotation = useSelector(rotationStore);
    if (!card) return null;
    // useEffect(() => {    
    //     if (JSON.stringify(inputCard) !== JSON.stringify(card)) setCard(inputCard);
    // }, [inputCard]);

    // const [, updateState] = React.useState();
    // const forceUpdate = React.useCallback(() => updateState({}), []);
    const setActiveCard = useSetActiveCard();

    const [isActive, setIsActive] = useState(false);
    const displayName = getDisplayName(card);
    //const groups = gameUIView.game_ui.game.groups;
    //const cardWatch = groups[group.id].stacks[stackIndex]?.cards[cardIndex];

    //if (groupId==='sharedStaging') console.log('rendering CardComponent');
    //if (groupId==='sharedStaging') console.log(card);

    // useEffect(() => {    
    //   if (card) setCard(card);
    // }, [card]);
    //console.log('rendering',group.id,stackIndex,cardIndex, "comp");

    const onClick = (event) => {
        console.log(card);
        console.log(playerN);
        console.log(card.peeking[playerN]);
        return;
    }

    const handleMouseLeave = (event) => {
        setIsActive(false);
        setActiveCard(null);
    }

    // const onDoubleClick = (event) => {
    //     //forceUpdate();
    //     if (group["type"] != "play") return;
    //     if (!card.exhausted) {
    //         card.exhausted = true;
    //         card.rotation = 90;
    //         chatBroadcast("game_update", {message: "exhausted "+displayName+"."});
    //     } else {
    //         card.exhausted = false;
    //         card.rotation = 0;
    //         chatBroadcast("game_update", {message: "readied "+displayName+"."});
    //     }
    //     gameBroadcast("update_card",{card: card, group_id: groupId, stack_index: stackIndex, card_index:cardIndex, temp:"ondoubleclick"});
    //     forceUpdate();
    // }
    // const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onClick, onDoubleClick);


    const menuID = card.id+'-menu';
    const zIndex = 1000-cardIndex;

    function handleMenuClick(e, data) {
        if (data.action === "detach") {
            gameBroadcast("card_action", {action: "detach", card_id: card.id, options: [cardId]})
            chatBroadcast("game_update", {message: "detached "+displayName+"."})
        }
        else if (data.action === "move_card") {
            const destGroupTitle = GROUPSINFO[data.destGroupId].name;
            if (data.position === "t") {
                gameBroadcast("card_action", {action: "move_card", card_id: card.id, options: [data.destGroupId, 0, 0, false, false]})
                chatBroadcast("game_update",{message: "moved "+displayName+" to top of "+destGroupTitle+"."})
            } else if (data.position === "b") {
                gameBroadcast("card_action", {action: "move_card", card_id: card.id, options: [data.destGroupId, -1, 0, false, false]})
                chatBroadcast("game_update",{message: "moved "+displayName+" to bottom of "+destGroupTitle+"."})
            } else if (data.position === "s") {
                gameBroadcast("card_action", {action: "move_card", card_id: card.id, options: [data.destGroupId, 0, 0, false, false]})
                gameBroadcast("shuffle_group", {group_id: data.destGroupId})
                chatBroadcast("game_update",{message: "shuffled "+displayName+" into "+destGroupTitle+"."})
            }
        }
    }
    
    const currentFace = getCurrentFace(card);
    console.log('rendering card ',currentFace.name);
    return (
        <div>
            <ContextMenuTrigger id={card.id} holdToDisplay={500}> 

            <div 
                className={isActive ? 'isActive' : ''}
                key={card.id}
                style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                    background: `url(${getVisibleFaceSRC(card,playerN)}) no-repeat scroll 0% 0% / contain`, //group.type === "deck" ? `url(${card.sides["B"].src}) no-repeat` : `url(${card.sides["A"].src}) no-repeat`,
                    height: `${CARDSCALE*currentFace.height}vw`,
                    width: `${CARDSCALE*currentFace.width}vw`,
                    left: `${0.2 + (1.39-currentFace.width)*CARDSCALE/2 + CARDSCALE/3*cardIndex}vw`,
                    top: `${0.2 + (1.39-currentFace.height)*CARDSCALE/2}vw`,
                    borderRadius: '6px',
                    MozBoxShadow: isActive ? '0 0 7px yellow' : '',
                    WebkitBoxShadow: isActive ? '0 0 7px yellow' : '',
                    boxShadow: isActive ? '0 0 7px yellow' : '',
                    transform: `rotate(${card.rotation}deg)`,
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
                onClick={onClick}
                //onDoubleClick={handleDoubleClick}
                onMouseLeave={event => handleMouseLeave(event)}
            >

                <CardMouseRegion 
                    position={"top"}
                    top={"0%"}
                    card={card}
                    setIsActive={setIsActive}
                />
                
                <CardMouseRegion 
                    position={"bottom"}
                    top={"50%"}
                    card={card}
                    setIsActive={setIsActive}
                />
                { isActive && (
                    <Tokens
                        cardName={currentFace.name}
                        cardType={currentFace.cardType}
                        tokensId={card.tokensId}
                        isActive={isActive}
                        gameBroadcast={gameBroadcast}
                        chatBroadcast={chatBroadcast}
                    />
                )}
                {card["peeking"][playerN]? <FontAwesomeIcon className="absolute flex-none text-4xl" icon={faEye}/>:null}
            </div>

            </ContextMenuTrigger>

            <ContextMenu id={card.id} style={{zIndex:1e8}}>
                <hr></hr>
                {cardIndex>0 ? <MenuItem onClick={handleMenuClick} data={{action: 'detach'}}>Detach</MenuItem>:null}
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
            </ContextMenu>
        </div>
    )
})


// class CardClass extends Component {

//     shouldComponentUpdate = (nextProps, nextState) => {
        
//         if ( 
//             (JSON.stringify(nextProps.inputCard)!==JSON.stringify(this.props.inputCard)) ||
//             (nextProps.groupId!==this.props.groupId) ||
//             (nextProps.stackIndex!==this.props.stackIndex) ||
//             (nextProps.cardIndex!==this.props.cardIndex)
//         ) {
//             return true;
//         } else {
//             return false; 
//         }
//     };
  
//     render() {
//         return(
//             <CardComponent
//                 inputCard={this.props.inputCard}
//                 cardIndex={this.props.cardIndex}
//                 stackIndex={this.props.stackIndex}
//                 groupId={this.props.groupId}
//                 gameBroadcast={this.props.gameBroadcast}
//                 chatBroadcast={this.props.chatBroadcast}
//                 playerN={this.props.playerN}
//             ></CardComponent>
//         )
//     }
// }


// const CardView = React.memo(({
//     inputCard,
//     cardIndex,
//     stackIndex,
//     groupId,
//     gameBroadcast,
//     chatBroadcast,
//     playerN,
//   }) => {
//     //if (groupId==='sharedStaging') console.log('rendering Cardview');
//     console.log('rendering',groupId,stackIndex,cardIndex, "view");
//     const cardObj = JSON.parse(inputCard);
//     return (
//         <CardClass
//             inputCard={cardObj}
//             cardIndex={cardIndex}
//             stackIndex={stackIndex}
//             groupId={groupId}
//             gameBroadcast={gameBroadcast}
//             chatBroadcast={chatBroadcast}
//             playerN={playerN}
//         ></CardClass>
//     )
// });

// export default CardView;



