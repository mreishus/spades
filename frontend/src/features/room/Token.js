import React, { useState, useEffect } from "react";
import { CARDSCALE } from "./Constants";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import cx from "classnames";

const tokenURLs = {
    "threat":    "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/39df75f2-141d-425f-b651-d572b4885004.png",
    "willpower": "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/f24eb0c4-8405-4599-ba80-95bc009ae9fb.png",
    "attack":    "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/53f20b83-6292-4017-abd0-511efdaf710d.png",
    "defense":   "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/6987d1a6-55ab-4ced-bbec-4e5b3490a40e.png",
    "resource":  "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/62a2ba76-9872-481b-b8fc-ec35447ca640.png",
    "damage":    "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/38d55f36-04d7-4cf9-a496-06cb84de567d.png",
    "progress":  "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/e9a419ff-5154-41cf-b84f-95149cc19a2a.png",
    "time":      "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/Sets/Markers%20and%20Tokens/Markers/31627422-f546-4a69-86df-ca0a028f3138.png",
}

export const Token = ({
    type,
    card,
    left,
    top,
    showButtons,
    broadcast,
    groupID,
    stackIndex,
    cardIndex,
}) => {
    const [buttonLeftVisible, setButtonLeftVisible] = useState(false);
    const [buttonRightVisible, setButtonRightVisible] = useState(false);
    const [amount, setAmount] = useState(card.tokens[type]);
    // useEffect(() => {

    //     const onKeyDown = ({key}) => {
    //         console.log(key);
    //         if (key === "t" && !adjustVisible && isHighlighted) {
    //             setAdjustVisible(true);
    //         }
    //     }

    //     const onKeyUp = ({key}) => {
    //         if (key === "t") {
    //             setAdjustVisible(false);
    //         }
    //     }

    //     document.addEventListener('keydown', onKeyDown);
    //     document.addEventListener('keyup', onKeyUp);

    //     return () => {
    //         document.removeEventListener('keydown', onKeyDown);
    //         document.removeEventListener('keyup', onKeyUp);
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isHighlighted]);

    // if (type==="resource") console.log('rendering resource',amount,card.tokens[type]);
    // console.log("visible",inputAdjustVisible,adjustVisible);





    //if (card.tokens[type] !== amount) setAmount(card.tokens[type]);




    // if (inputAdjustVisible && !adjustVisible) setAdjustVisible(true);
    // if (!inputAdjustVisible && adjustVisible) {
    //     const newTokens = {
    //         ...card.tokens,
    //         [type]: amount,
    //     }
    //     const newCard = {
    //         ...card,
    //         tokens: newTokens,
    //     }
    //     console.log("newcard",newCard);
    //     broadcast("update_card", {card: newCard, group_id: groupID, stack_index: stackIndex, card_index:cardIndex, temp:"clickarrow"});
    //     setAdjustVisible(false);
    // }

    useEffect(() => {    
        if (card.tokens[type] !== amount) setAmount(card.tokens[type]);
    }, [card.tokens[type]]);

    function clickArrow(event,delta) {
        event.stopPropagation();
        setAmount(amount+delta);

        const newTokens = {
            ...card.tokens,
            [type]: amount+delta,
        }
        const newCard = {
            ...card,
            tokens: newTokens,
        }
        console.log("newcard",newCard);
        broadcast("update_card", {card: newCard, group_id: groupID, stack_index: stackIndex, card_index:cardIndex, temp:"clickarrow"});


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
                backgroundImage: `url(${tokenURLs[type]})`,
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
  }
  
  export default Token;