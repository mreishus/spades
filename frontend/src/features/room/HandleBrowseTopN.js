import { GROUPSINFO } from "./Constants";
import { useSelector, useDispatch } from 'react-redux';

export const handleBrowseTopN = (
    topNstr, 
    group,
    playerN,
    gameBroadcast, 
    chatBroadcast,
    setBrowseGroupId,
    setBrowseGroupTopN,
) => {
    const stackIds = group["stackIds"];
    const numStacks = stackIds.length;
    const groupName = GROUPSINFO[group.id].name;
    var peekStackIds = [];
    var peekStackIndices = [];
    var peekCardIndices = [];
    var topNint = 0;
    
    // Set peeking based on topNstr
    if (topNstr === "All") {
      topNint = numStacks;
      peekStackIds = stackIds;
      chatBroadcast("game_update",{message: "looks at "+groupName+"."})
    } else if (topNstr === "None") {
      topNint = numStacks; 
      peekStackIds = [];
      chatBroadcast("game_update",{message: "stopped looking at "+groupName+"."})
    } else {
      topNint = parseInt(topNstr);
      peekStackIds = stackIds.slice(0, topNint);
      chatBroadcast("game_update",{message: "looks at top "+topNstr+" of "+groupName+"."})
    }
    setBrowseGroupId(group.id);
    setBrowseGroupTopN(topNstr);
    gameBroadcast("game_action", {action: "peek_at", options: {player_n: playerN, stack_ids: peekStackIds, value: true}})
}