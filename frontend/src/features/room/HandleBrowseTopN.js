import { GROUPSINFO } from "./Constants";

export const handleBrowseTopN = (
    topNstr, 
    group,
    playerN,
    gameBroadcast, 
    chatBroadcast,
    setBrowseGroupId,
    setBrowseGroupTopN,
) => {
    const stacks = group["stacks"];
    const numStacks = stacks.length;
    const groupName = GROUPSINFO[group.id].name;
    var peekStackIndices = [];
    var peekCardIndices = [];
    var topNint = 0;
    
    // Set peeking based on topNstr
    if (topNstr === "All") {
      topNint = numStacks;
      peekStackIndices = [...Array(topNint).keys()];
      peekCardIndices = new Array(topNint).fill(0);
      chatBroadcast("game_update",{message: "looks at "+groupName+"."})
    } else if (topNstr === "None") {
      topNint = numStacks; 
      peekStackIndices = [];
      peekCardIndices = [];
      chatBroadcast("game_update",{message: "stopped looking at "+groupName+"."})
    } else {
      topNint = parseInt(topNstr);
      peekStackIndices = [...Array(topNint).keys()];
      peekCardIndices = new Array(topNint).fill(0);
      chatBroadcast("game_update",{message: "looks at top "+topNstr+" of "+groupName+"."})
    }
    setBrowseGroupId(group.id);
    setBrowseGroupTopN(topNstr);
    gameBroadcast("peek_at", {group_id: group.id, stack_indices: peekStackIndices, card_indices: peekCardIndices, player_n: playerN, reset_peek: true})
}