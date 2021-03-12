import React, {useContext} from "react";
import { Token } from "./Token";
import { useKeypress } from "../../contexts/KeypressContext";

export const Tokens = React.memo(({ 
    cardId,
    cardName,
    cardType,
    gameBroadcast,
    chatBroadcast,
 }) => {
    console.log("rendering tokens");
    const keypress = useKeypress();
    const showButtons = keypress[0] === "Shift";
    if (true) {
        return(
            <div style={{width:'100%',height:'100%'}}>
                <Token type="resource"  cardId={cardId} cardName={cardName} left={"10%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="progress"  cardId={cardId} cardName={cardName} left={"10%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="damage"    cardId={cardId} cardName={cardName} left={"10%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="time"      cardId={cardId} cardName={cardName} left={"10%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="threat"    cardId={cardId} cardName={cardName} left={"55%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="willpower" cardId={cardId} cardName={cardName} left={"55%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="attack"    cardId={cardId} cardName={cardName} left={"55%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="defense"   cardId={cardId} cardName={cardName} left={"55%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            </div>
        )
    } else {
        return null;
    }
});