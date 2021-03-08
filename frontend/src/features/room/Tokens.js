import React, {useContext} from "react";
import { Token } from "./Token";
import { useKeypress } from "../../contexts/KeypressContext";

export const Tokens = React.memo(({ 
    tokensId,
    cardName,
    cardType,
    gameBroadcast,
    chatBroadcast,
 }) => {
    const keypress = useKeypress();
    const showButtons = keypress[0] === "Shift";
    if (showButtons) {
        return(
            <div style={{width:'100%',height:'100%'}}>
                <Token type="resource"  tokensId={tokensId} cardName={cardName} left={"10%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="progress"  tokensId={tokensId} cardName={cardName} left={"10%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="damage"    tokensId={tokensId} cardName={cardName} left={"10%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="time"      tokensId={tokensId} cardName={cardName} left={"10%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="threat"    tokensId={tokensId} cardName={cardName} left={"55%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="willpower" tokensId={tokensId} cardName={cardName} left={"55%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="attack"    tokensId={tokensId} cardName={cardName} left={"55%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
                <Token type="defense"   tokensId={tokensId} cardName={cardName} left={"55%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast}></Token>
            </div>
        )
    } else {
        return null;
    }
});