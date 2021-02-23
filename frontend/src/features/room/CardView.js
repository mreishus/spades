import React, { useState, useEffect, useRef, Component } from "react";
import { TokensView } from './TokensView';
import { playerBackSRC, encounterBackSRC } from "./Constants"
import { getCardFaceSRC } from "./CardBack"
import { CARDSCALE, GROUPSINFO } from "./Constants"
import styled from "@emotion/styled";
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import { CardMouseRegion } from "./CardMouseRegion"
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export const getCurrentFace = (card) => {
    return card["sides"][card["currentSide"]];
}

export const getDisplayName = (card) => {
    const currentSide = card["currentSide"];
    const currentFace = getCurrentFace(card);
    if (currentSide == "A") {
        const printName = currentFace["printname"];
        const id = card["id"];
        const id4digit = id.substr(id.length - 4);
        return printName+' ('+id4digit+')';
    } else { // Side B logic
        const sideBName = card["sides"]["B"]["name"];
        if (sideBName == "player") {
            return 'player card';
        } else if (sideBName == "encounter") {
            return 'encounter card';
        } else if (sideBName) {
            const printName = currentFace["printname"];
            const id = card["id"];
            const id4digit = id.substr(id.length - 4);
            return printName+' ('+id4digit+')';
        } else {
            return 'undefinedCard';
        }
    }
}

export const getFlippedCard = (card) => {
    return (card["currentSide"] === "A") ? {...card, ["currentSide"]: "B"} : {...card, ["currentSide"]: "A"};
}

export const getDisplayNameFlipped = (card) => {
    return getDisplayName(getFlippedCard(card));
}

export const getVisibleSide = (card, PlayerN) => {
    if (!card) return null;
    const currentSide = card["currentSide"];
    if (currentSide == "A" || card["peeking"][PlayerN]) return "A";
    else return "B";
}

export const getVisibleFace = (card, PlayerN) => {
    const visibleSide = getVisibleSide(card, PlayerN);
    if (visibleSide) return card["sides"][visibleSide];
    else return null;
}

export const getVisibleFaceSRC = (card, PlayerN) => {
    if (!card) return "";
    const visibleSide = getVisibleSide(card);
    if (visibleSide == "A") {
        return process.env.PUBLIC_URL + '/images/cards/' + card['cardid'] + '.jpg';
    } else { // Side B logic
        const sideBName = card["sides"]["B"]["name"];
        if (sideBName == "player") {
            return process.env.PUBLIC_URL + '/images/cardbacks/player.jpg';
        } else if (sideBName == "encounter") {
            return process.env.PUBLIC_URL + '/images/cardbacks/encounter.jpg';
        } else if (sideBName) {
            return process.env.PUBLIC_URL + '/images/cards/' + card['cardid'] + '.B.jpg';
        } else {
            return '';
        }
    }
}


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





const CardComponent = React.memo(({
    inputCard,
    cardIndex,
    stackIndex,
    groupID,
    group,
    gameBroadcast,
    chatBroadcast,
    PlayerN,
}) => {
    //const [card, setCard] = useState(inputCard);

    // I know that forceUpdate is a sign I'm doing something wrong. But without it I will
    // occasionally have cards refuse to rerender ater calling a broadcast. For some reason
    // the shouldComponentUpdate aleady sees the next state and thinks its the same as the
    // current one, so it doesn't update.
    console.log('rendering ',groupID,stackIndex,cardIndex)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const setActiveCard = useSetActiveCard();

    const [isActive, setIsActive] = useState(false);
    const displayName = getDisplayName(inputCard);
    //const groups = gameUIView.game_ui.game.groups;
    //const cardWatch = groups[group.id].stacks[stackIndex]?.cards[cardIndex];

    //if (groupID==='gSharedStaging') console.log('rendering CardComponent');
    //if (groupID==='gSharedStaging') console.log(inputCard);

    // useEffect(() => {    
    //   if (inputCard) setCard(inputCard);
    // }, [inputCard]);
    //console.log('rendering',group.id,stackIndex,cardIndex, "comp");


    const onClick = (event) => {
        console.log(inputCard);
        console.log(PlayerN);
        console.log(inputCard["peeking"][PlayerN]);
        return;
    }

    const handleMouseOver = (event) => {
        setIsActive(true);
    }

    const handleMouseLeave = (event) => {
        setIsActive(false);
        setActiveCard(null);
    }

    // const onDoubleClick = (event) => {
    //     //forceUpdate();
    //     if (group["type"] != "play") return;
    //     if (!inputCard.exhausted) {
    //         inputCard.exhausted = true;
    //         inputCard.rotation = 90;
    //         chatBroadcast("game_update", {message: "exhausted "+displayName+"."});
    //     } else {
    //         inputCard.exhausted = false;
    //         inputCard.rotation = 0;
    //         chatBroadcast("game_update", {message: "readied "+displayName+"."});
    //     }
    //     gameBroadcast("update_card",{card: inputCard, group_id: groupID, stack_index: stackIndex, card_index:cardIndex, temp:"ondoubleclick"});
    //     forceUpdate();
    // }
    // const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onClick, onDoubleClick);


    const menuID = inputCard.id+'-menu';
    const zIndex = 1000-cardIndex;

    function handleMenuClick(e, data) {
        if (data.action === "detach") {
            gameBroadcast("detach", {group_id: groupID, stack_index: stackIndex, card_index: cardIndex})
            chatBroadcast("game_update",{message: "detached "+displayName+"."})
        }
        else if (data.action === "move_card") {
            const sourceGroupTitle = GROUPSINFO[groupID].name;
            const destGroupTitle = GROUPSINFO[data.destGroupID].name;
            if (data.position === "t") {
                gameBroadcast("move_card", {orig_group_id: groupID, orig_stack_index: stackIndex, orig_card_index: cardIndex, dest_group_id: data.destGroupID, dest_stack_index: 0, dest_card_index: 0, create_new_stack: true})
                chatBroadcast("game_update",{message: "moved "+displayName+" from "+sourceGroupTitle+" to top of "+destGroupTitle+"."})
            } else if (data.position === "b") {
                gameBroadcast("move_card", {orig_group_id: groupID, orig_stack_index: stackIndex, orig_card_index: cardIndex, dest_group_id: data.destGroupID, dest_stack_index: -1, dest_card_index: 0, create_new_stack: true})
                chatBroadcast("game_update",{message: "moved "+displayName+" from "+sourceGroupTitle+" to bottom of "+destGroupTitle+"."})
            } else if (data.position === "s") {
                gameBroadcast("move_card", {orig_group_id: groupID, orig_stack_index: stackIndex, orig_card_index: cardIndex, dest_group_id: data.destGroupID, dest_stack_index: 0, dest_card_index: 0, create_new_stack: true})
                gameBroadcast("shuffle_group", {group_id: data.destGroupID})
                chatBroadcast("game_update",{message: "shuffled "+displayName+" from "+sourceGroupTitle+" into "+destGroupTitle+"."})
            }
        }
    }
    
    if (!inputCard) return <div></div>;
    const currentFace = getCurrentFace(inputCard);
    return (
        <div>
            <ContextMenuTrigger id={inputCard.id} holdToDisplay={500}> 

            <div 
                className={isActive ? 'isActive' : ''}
                key={inputCard.id}
                style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                    background: `url(${getVisibleFaceSRC(inputCard,PlayerN)}) no-repeat scroll 0% 0% / contain`, //group.type === "deck" ? `url(${inputCard.sides["B"].src}) no-repeat` : `url(${inputCard.sides["A"].src}) no-repeat`,
                    height: `${CARDSCALE*currentFace.height}vw`,
                    width: `${CARDSCALE*currentFace.width}vw`,
                    left: `${0.2 + (1.39-currentFace.width)*CARDSCALE/2 + CARDSCALE/3*cardIndex}vw`,
                    top: `${0.2 + (1.39-currentFace.height)*CARDSCALE/2}vw`,
                    borderRadius: '6px',
                    MozBoxShadow: isActive ? '0 0 7px yellow' : '',
                    WebkitBoxShadow: isActive ? '0 0 7px yellow' : '',
                    boxShadow: isActive ? '0 0 7px yellow' : '',
                    transform: `rotate(${inputCard.rotation}deg)`,
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
                onMouseOver={event => handleMouseOver(event)}
                onMouseLeave={event => handleMouseLeave(event)}
            >
                {/* <div style={{position:'absolute',width:"50%",height:"100%",backgroundColor:"green"}}></div>
                <div style={{position:'absolute',width:"100%",height:"50%",backgroundColor:"red"}}></div>
                <div style={{position:'absolute',left:"50%",width:"50%",height:"100%",backgroundColor:"blue"}}></div> */}

                <CardMouseRegion 
                    position={"top"}
                    top={"0%"}
                    card={inputCard}
                    groupID={groupID}
                    stackIndex={stackIndex}
                    cardIndex={cardIndex}
                ></CardMouseRegion>
                
                <CardMouseRegion 
                    position={"bottom"}
                    top={"50%"}
                    card={inputCard}
                    groupID={groupID}
                    stackIndex={stackIndex}
                    cardIndex={cardIndex}
                ></CardMouseRegion>

                <TokensView 
                    card={inputCard} 
                    isActive={isActive} 
                    gameBroadcast={gameBroadcast} 
                    chatBroadcast={chatBroadcast} 
                    groupID={groupID} 
                    stackIndex={stackIndex} 
                    cardIndex={cardIndex}
                ></TokensView>

                {inputCard["peeking"][PlayerN]? <FontAwesomeIcon className="absolute flex-none text-4xl" icon={faEye}/>:null}

            </div>

            </ContextMenuTrigger>

            <ContextMenu id={inputCard.id} style={{zIndex:1e6}}>
                <hr></hr>
                {cardIndex>0 ? <MenuItem onClick={handleMenuClick} data={{action: 'detach'}}>Detach</MenuItem>:null}
                <SubMenu title='Move to'>
                    <SubMenu title='Encounter Deck'>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupID: "gSharedEncounterDeck", position: "t"}}>Top</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupID: "gSharedEncounterDeck", position: "b"}}>Bottom</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupID: "gSharedEncounterDeck", position: "s"}}>Shuffle in (h)</MenuItem>
                    </SubMenu>
                    <SubMenu title="Owner's Deck">
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupID: "g"+inputCard.owner+"Deck", position: "t"}}>Top</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupID: "g"+inputCard.owner+"Deck", position: "b"}}>Bottom</MenuItem>
                        <MenuItem onClick={handleMenuClick} data={{action: 'move_card', destGroupID: "g"+inputCard.owner+"Deck", position: "s"}}>Shuffle in (h)</MenuItem>
                    </SubMenu>
                    <MenuItem onClick={handleMenuClick} data={{ action: 'move_card', groupID: groupID, stackIndex: stackIndex, cardIndex: cardIndex, destGroupID: "gSharedVictory", position: "t" }}>Victory Display</MenuItem>
                </SubMenu>
            </ContextMenu>
        </div>
    )
})


class CardClass extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        
        if ( 
            (JSON.stringify(nextProps.inputCard)!==JSON.stringify(this.props.inputCard)) ||
            (nextProps.groupID!==this.props.groupID) ||
            (nextProps.stackIndex!==this.props.stackIndex) ||
            (nextProps.cardIndex!==this.props.cardIndex)
        ) {
            return true;
        } else {
            return false; 
        }
    };
  
    render() {
        return(
            <CardComponent
                inputCard={this.props.inputCard}
                cardIndex={this.props.cardIndex}
                stackIndex={this.props.stackIndex}
                groupID={this.props.groupID}
                group={this.props.group}
                gameBroadcast={this.props.gameBroadcast}
                chatBroadcast={this.props.chatBroadcast}
                PlayerN={this.props.PlayerN}
            ></CardComponent>
        )
    }
}


const CardView = React.memo(({
    inputCard,
    cardIndex,
    stackIndex,
    groupID,
    group,
    gameBroadcast,
    chatBroadcast,
    PlayerN,
  }) => {
    //if (groupID==='gSharedStaging') console.log('rendering Cardview');
    console.log('rendering',group.id,stackIndex,cardIndex, "view");


    return (

        <CardClass
            inputCard={inputCard}
            cardIndex={cardIndex}
            stackIndex={stackIndex}
            groupID={groupID}
            group={group}
            gameBroadcast={gameBroadcast}
            chatBroadcast={chatBroadcast}
            PlayerN={PlayerN}
        ></CardClass>



    )
});

export default CardView;



