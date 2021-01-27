import React, {useContext} from "react";
import { Token } from "./Token";
import { useKeypress } from "../../contexts/KeypressContext";

const InnerTokensView = React.memo(({ 
    card,
    showButtons,
    gameBroadcast,
    chatBroadcast,
    groupID,
    stackIndex,
    cardIndex,
 }) => (
    <div style={{width:'100%',height:'100%'}}>
        <Token type="resource"  card={card} left={"10%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
        <Token type="progress"  card={card} left={"10%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
        <Token type="damage"    card={card} left={"10%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
        <Token type="time"      card={card} left={"10%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
        <Token type="threat"    card={card} left={"55%"} top={"0%"}  showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
        <Token type="willpower" card={card} left={"55%"} top={"25%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
        <Token type="attack"    card={card} left={"55%"} top={"50%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
        <Token type="defense"   card={card} left={"55%"} top={"75%"} showButtons={showButtons} gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} groupID={groupID} stackIndex={stackIndex} cardIndex={cardIndex}></Token>
    </div>
));
  
export const TokensView = ({
    card,
    isActive,
    gameBroadcast,
    chatBroadcast,
    groupID,
    stackIndex,
    cardIndex,
}) => {
    const keypress = useKeypress();
    const showButtons = keypress[0] === "Shift" && isActive;
    
    return (
        <InnerTokensView 
            card={card}
            showButtons={showButtons}
            gameBroadcast={gameBroadcast}
            chatBroadcast={chatBroadcast}
            groupID={groupID}
            stackIndex={stackIndex}
            cardIndex={cardIndex}
        />
    );
};
  
export default TokensView;