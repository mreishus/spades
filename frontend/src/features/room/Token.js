import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { CARDSCALE } from "./Constants";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import cx from "classnames";

var delayBroadcast;

export const Token = React.memo(({
    cardId,
    cardName,
    type,
    left,
    top,
    showButtons,
    gameBroadcast,
    chatBroadcast,
}) => {
    const tokenStore = state => state?.gameUi?.game?.cardById?.[cardId]?.tokens?.[type];
    const tokenValue = useSelector(tokenStore);
    console.log('rendering token on ',cardId, tokenValue);
    //console.log(gameUI.game.groups[groupId].stacks)
    const [buttonLeftVisible, setButtonLeftVisible] = useState(false);
    const [buttonRightVisible, setButtonRightVisible] = useState(false);
    const [amount, setAmount] = useState(tokenValue);

    useEffect(() => {    
        if (tokenValue !== amount) setAmount(tokenValue);
    }, [tokenValue]);

    if (!tokenValue) return null;

    function clickArrow(event,delta) {
        event.stopPropagation();
        var newAmount = 0;
        if ((type==="resource" || type==="progress" || type==="damage" || type==="time") && (amount+delta < 0)) {
            newAmount = 0;
        } else {
            newAmount = amount+delta;
        }
        setAmount(newAmount);
        // Determine total number of tokens added or removed since last broadcast
        const totalDelta = newAmount-tokenValue;
        // Set up a delayed broadcast to update the game state that interupts itself if the button is clicked again shortly after.
        if (delayBroadcast) clearTimeout(delayBroadcast);
        delayBroadcast = setTimeout(function() {
            gameBroadcast("update_value",{path: ["game", "cardById", cardId, "tokens", type], value: newAmount});
            //gameBroadcast("increment_token",{tokens_id: tokensId, type: type, increment: totalDelta})
            //gameBroadcast("update_card", {card: newCard, group_id: groupId, stack_index: stackIndex, card_index:cardIndex});
            if (totalDelta > 0) {
                if (totalDelta === 1) {
                    chatBroadcast("game_update",{message: "added "+totalDelta+" "+type+" token to "+cardName+"."});
                } else {
                    chatBroadcast("game_update",{message: "added "+totalDelta+" "+type+" tokens to "+cardName+"."});
                }
            } else if (totalDelta < 0) {
                if (totalDelta === -1) {
                    chatBroadcast("game_update",{message: "removed "+(-totalDelta)+" "+type+" token from "+cardName+"."});
                } else {
                    chatBroadcast("game_update",{message: "removed "+(-totalDelta)+" "+type+" tokens from "+cardName+"."});
                }                
            }
        }, 500);
        


    }
    function handleDoubleClick(event) {
        event.stopPropagation();
    }

    // document.onkeydown = function(evt) {
    //     evt = evt || window.event;
    //     if (evt.shiftKey) {
    //         setAdjustVisible(true);
    //     }
    // };

    // document.onkeyup = function(evt) {
    //     evt = evt || window.event;
    //     if (evt.shiftKey) {
    //         setAdjustVisible(false);
    //     }
    // };

    return(
        <div
            
            style={{
                position: "absolute",
                left: `${left}`,
                top: `${top}`,
                height: `${CARDSCALE/0.72/4}vw`,
                width: `${CARDSCALE/0.72/4}vw`,
                backgroundImage: `url(${process.env.PUBLIC_URL + '/images/tokens/'+type+'.png'})`,
                backgroundSize: "contain",
                //zIndex: 1e6,
                display: showButtons || amount!==0 ? "block" : "none",
            }}
        >

            <p 
                className="text-center text-sm"
                style={{
                    position: "absolute",
                    color: "white", 
//                    textShadow: "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000", 
                    textShadow: "rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.75517px 0.958851px 0px, rgb(0, 0, 0) 1.0806px 1.68294px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.81859px 0px, rgb(0, 0, 0) -1.60229px 1.19694px 0px, rgb(0, 0, 0) -1.97999px 0.28224px 0px, rgb(0, 0, 0) -1.87291px -0.701566px 0px, rgb(0, 0, 0) -1.30729px -1.51361px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.91785px 0px, rgb(0, 0, 0) 1.41734px -1.41108px 0px, rgb(0, 0, 0) 1.92034px -0.558831px 0px",
                    top: "17%",
                    width: "100%",
            }}>
                {(type==="threat" || type==="willpower" || type==="attack" || type==="defense") && amount>0 ? "+"+amount : amount}
            </p>

            <div
                className="text-center text-sm"
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "50%",
                    backgroundColor: "black",
                    opacity: buttonLeftVisible ? "65%" : "0%",
                    display: showButtons ? "block" : "none",
                    //zIndex: zIndex + 200,
                }}
                onMouseOver={() => setButtonLeftVisible(true)}
                onMouseLeave={() => setButtonLeftVisible(false)}
                onClick={(event) => clickArrow(event,-1)}
                onDoubleClick={(event) => handleDoubleClick(event)}
            >
                <FontAwesomeIcon 
                    className="text-white" 
                    style={{
                        position:"absolute", 
                        top:"25%", 
                        left:"20%",
                    }}  
                    icon={faChevronLeft}/>
            </div>

            <div
                className="text-center text-sm"
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "50%",
                    left: "50%",
                    backgroundColor: "black",
                    opacity: buttonRightVisible ? "65%" : "0%",
                    display: showButtons ? "block" : "none",
                    //zIndex: zIndex + 200,
                }}
                onMouseOver={() => setButtonRightVisible(true)}
                onMouseLeave={() => setButtonRightVisible(false)}
                onClick={(event) => clickArrow(event,1)}
                onDoubleClick={(event) => handleDoubleClick(event)}
            >
                <FontAwesomeIcon 
                    className="text-white" 
                    style={{
                        position:"absolute", 
                        top:"25%", 
                        left:"30%",
                    }} 
                    icon={faChevronRight}/>
            </div>
        </div>
    )
})