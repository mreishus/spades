import React, {useContext} from "react";
import { Token } from "./Token";
import { useKeypress } from "../../contexts/KeypressContext";

export const Tokens = React.memo(({ 
    cardId,
    cardName,
    cardType,
    isActive,
    gameBroadcast,
    chatBroadcast,
 }) => {
    console.log("rendering tokens");
    const keypress = useKeypress();
    const showButtons = isActive && keypress["Shift"];
    return(
        <div style={{width:'100%', height:'100%'}}>
            <Token tokenType="resource"  cardId={cardId} cardName={cardName} left={"10%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            <Token tokenType="progress"  cardId={cardId} cardName={cardName} left={"10%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            <Token tokenType="damage"    cardId={cardId} cardName={cardName} left={"10%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            <Token tokenType="time"      cardId={cardId} cardName={cardName} left={"10%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            <Token tokenType="threat"    cardId={cardId} cardName={cardName} left={"55%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            <Token tokenType="willpower" cardId={cardId} cardName={cardName} left={"55%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            <Token tokenType="attack"    cardId={cardId} cardName={cardName} left={"55%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            <Token tokenType="defense"   cardId={cardId} cardName={cardName} left={"55%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
        </div>
    )
});