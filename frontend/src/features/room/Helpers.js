export const getCurrentFace = (card) => {
  if (!card?.currentSide) return null;
  return card.sides[card.currentSide];
}

export const getDisplayName = (card) => {
  if (!card) return;
  const currentSide = card.currentSide;
  const currentFace = getCurrentFace(card);
  if (currentSide === "A") {
      const printName = currentFace.printName;
      const id = card.id;
      const id4digit = id.substr(id.length - 4);
      return printName;//+' ('+id4digit+')'; // Add unique identifier?
  } else { // Side B logic
      const sideBName = card.sides.B.name;
      if (sideBName === "player") {
          return 'player card';
      } else if (sideBName === "encounter") {
          return 'encounter card';
      } else if (sideBName) {
          const printName = currentFace.printName;
          const id = card["id"];
          const id4digit = id.substr(id.length - 4);
          return printName;//+' ('+id4digit+')'; // Add unique identifier?
      } else {
          return 'undefinedCard';
      }
  }
}

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

export const getFlippedCard = (card) => {
  return (card.currentSide === "A") ? {...card, ["currentSide"]: "B"} : {...card, ["currentSide"]: "A"};
}

export const getDisplayNameFlipped = (card) => {
  return getDisplayName(getFlippedCard(card));
}

export const getVisibleSide = (card, playerN) => {
  if (!card) return null;
  const currentSide = card.currentSide;
  if (currentSide === "A" || card.peeking[playerN]) return "A";
  else if (currentSide === "A" || (card.peeking["player1"] && card.peeking["player2"] && card.peeking["player3"] && card.peeking["player4"])) return "A";
  else return "B";
}

export const getVisibleFace = (card, playerN) => {
  const visibleSide = getVisibleSide(card, playerN);
  if (visibleSide) return card.sides[visibleSide];
  else return null;
}

export const getVisibleFaceSRC = (card, playerN) => {
  if (!card) return "";
  const visibleSide = getVisibleSide(card, playerN);
  if (visibleSide === "A") {
      return process.env.PUBLIC_URL + '/images/cards/' + card['cardDbId'] + '.jpg';
  } else { // Side B logic
      const sideBName = card.sides.B.name;
      if (sideBName === "player") {
          return process.env.PUBLIC_URL + '/images/cardbacks/player.jpg';
      } else if (sideBName === "encounter") {
          return process.env.PUBLIC_URL + '/images/cardbacks/encounter.jpg';
      } else if (sideBName) {
          return process.env.PUBLIC_URL + '/images/cards/' + card['cardDbId'] + '.B.jpg';
      } else {
          return '';
      }
  }
}

export const usesThreatToken = (card) => {
  console.log("getCurrentFace", card)
  const cardFace = getCurrentFace(card);
  if (["Contract", "Hero", "Ally", "Attachment", "Event", "Objective Ally"].includes(cardFace.type)) return false;
  if (card.controller != "shared") return false;
  if (cardFace.willpower > 0) return false;
  return true;
} 

export const processTokenType = (tokenType, card) => {
  if (tokenType === "willpowerThreat") return usesThreatToken(card) ? "threat" : "willpower";
  return tokenType;
}

export const tokenPrintName = (tokenType) => {
  if (tokenType === "hitPoints") return "hit points";
  return tokenType;
}

export const tokenTitleName = (tokenType) => {
  if (tokenType === "hitPoints") return "hit points";
  const printName = tokenPrintName(tokenType);
  return printName.charAt(0).toUpperCase() + printName.slice(1)
}

export const getCardWillpower = (card) => {
  const currentFace = getCurrentFace(card);
  return currentFace.willpower + card.tokens.willpower;
}

export const GetPlayerN = (playerIDs, id) => {
  if (!playerIDs) return null;
  var playerN = null;
  Object.keys(playerIDs).forEach(playerI => {
    if (playerIDs[playerI] === id) playerN = playerI;
  })
  return playerN;
}

export const getParentCardsInGroup = (game, groupId) => {
  const stackIds = game.groupById[groupId].stackIds;
  const parentCards = [];
  for (var stackId of stackIds) {
    const cardIds = game.stackById[stackId].cardIds;
    const parentCardId = cardIds[0];
    const parentCard = game.cardById[parentCardId];
    parentCards.push(parentCard);
  }
  return parentCards;
}

// List of playerN strings of seats that are not eliminated
 export const nonEliminated = (gameUi) => {
  const playerIDs = gameUi.playerIds;
  const playerData = gameUi.game.playerData;
  var playerNs = [];
  for (var i = 1; i<= gameUi.game.numPlayers; i++) {
    const playerI = "player"+i;
    if (!playerData[playerI].eliminated) playerNs.push(playerI);
  }
  return playerNs;
}

 // List of playerN strings of players that are seated and not eliminated
export const seatedNonEliminated = (gameUi) => {
  const playerIDs = gameUi.playerIds;
  const playerData = gameUi.game.playerData;
  var seated = []
  Object.keys(playerIDs).forEach((PlayerI) => {
    if (playerIDs[PlayerI] && !playerData[PlayerI].eliminated) {
      seated.push(PlayerI);
    }
  })
  return seated;
}

export const leftmostNonEliminatedPlayerN = (gameUi) => {
  const nonEliminatedPlayerNs = nonEliminated(gameUi);
  return nonEliminatedPlayerNs[0];
}

export const getNextPlayerN = (gameUi, playerN) => {
  const nonEliminatedPlayerNs = nonEliminated(gameUi);
  const nonEliminatedPlayerNs2 = nonEliminatedPlayerNs.concat(nonEliminatedPlayerNs);
  var nextPlayerN = null;
  for (var i=0; i<nonEliminatedPlayerNs2.length/2; i++) {
    if (nonEliminatedPlayerNs2[i] === playerN) nextPlayerN = nonEliminatedPlayerNs2[i+1];
  }
  if (nextPlayerN === playerN) nextPlayerN = null;
  return nextPlayerN;
}

export const flatListOfCards = (game) => {
  const groupById = game.groupById;
  const allCards = [];
  Object.keys(groupById).forEach((groupId) => {
    const group = groupById[groupId];
    const stackIds = group.stackIds;
    for (var s=0; s<stackIds.length; s++) {
      const stackId = stackIds[s];
      const stack = game.stackById[stackId];
      const cardIds = stack.cardIds;
      for (var c=0; c<cardIds.length; c++) {
        const cardId = cardIds[c];
        const card = game.cardById[cardId];
        const indexedCard = {
          ...card,
          ["groupId"]: groupId,
          ["stackIndex"]: s,
          ["cardIndex"]: c,
          ["groupType"]: group.type,
        }
        allCards.push(indexedCard);
      }
    }
  })
  return allCards;
}

export const passesCriteria = (card, criteria) => {
  for (var criterion of criteria) {
    var objectToCheck = card;
    console.log("crit 0 ",criterion[0]);
    switch(criterion[0]) {
      case "sideA":
        console.log("A");
        objectToCheck = card["sides"]["A"];
        break;
      case "sideB":
        console.log("B");
        objectToCheck = card["sides"]["B"];
        break;
      case "sideUp":
        console.log("up");
        objectToCheck = getCurrentFace(card);
        break;
      case "sideDown":
        console.log("dwn");
        if (card["currentSide"] === "A") objectToCheck = card["sides"]["B"];
        else objectToCheck = card["sides"]["A"];
        break;
      case "tokens":
        console.log("tok");
        objectToCheck = card["tokens"];
        break;
      case "peeking":
        console.log("peek");
        objectToCheck = card["peeking"];
        break;
    }
    const property = criterion[1];
    const value = criterion[2];
    const passed_criterion = objectToCheck[property] === value;
    console.log("checking if ",objectToCheck,property,objectToCheck[property],value, passed_criterion   );
    if (!passed_criterion) return false;
  }
  return true;
}

const listOfMatchingCards = (gameUi, criteria) => {
  const allCards = flatListOfCards(gameUi);
  const matchingCards = [];
  for (var card of allCards) {
    if (passesCriteria(card, criteria)) {
      matchingCards.push(card);
    }
  }
  return matchingCards;
}

export const functionOnMatchingCards = (gameUi, gameBroadcast, chatBroadcast, criteria, func, args ) => {
  const cards = listOfMatchingCards(gameUi, criteria);
  for (var card of cards) {
    const cardName = getCurrentFace(card).printName;
    const groupId = card["group_id"];
    const stackIndex = card["stack_index"];
    const cardIndex = card["card_index"];
    console.log("performing function on matching cards")
    switch(func) {
      case "increment_token":
        const tokenType = args[0];
        const increment = args[1];
        gameBroadcast("game_action", {action: func, options: {group_id: groupId, stack_index: stackIndex, card_index: cardIndex, token_type: tokenType, increment: increment}})
        if (increment > 0) {
            if (increment === 1) chatBroadcast("game_update",{message: "added "+increment+" "+tokenType+" token to "+cardName+"."});
            else chatBroadcast("game_update",{message: "added "+increment+" "+tokenType+" tokens to "+cardName+"."});
        } else if (increment < 0) {
            if (increment === -1) chatBroadcast("game_update",{message: "removed "+(-increment)+" "+tokenType+" token from "+cardName+"."});
            else chatBroadcast("game_update",{message: "removed "+(-increment)+" "+tokenType+" tokens from "+cardName+"."});                
        }
        break;
    }
  }
}

export const getGroupByStackId = (groupById, stackId) => {
  const groupIds = Object.keys(groupById);
  for (var groupId of groupIds) {
    const group = groupById[groupId]; 
    if (group.stackIds.includes(stackId)) return group; 
  }
  return null;
}

export const getStackByCardId = (stackById, cardId) => {
  const stackIds = Object.keys(stackById);
  for (var stackId of stackIds) {
    const stack = stackById[stackId]; 
    if (stack.cardIds.includes(cardId)) return stack; 
  }
  return null;
}

export const getGroupIdStackIndexCardIndex = (game, cardId) => {
  const stack = getStackByCardId(game.stackById, cardId);
  if (!stack) return null;
  const group = getGroupByStackId(game.groupById, stack.id);
  if (!group) return null;
  return ({
    groupId: group.id, 
    stackIndex: group.stackIds.indexOf(stack.id), 
    cardIndex: stack.cardIds.indexOf(cardId)
  })
}

const isCardDbIdInLoadList = (loadList, cardDbId) => {
  for (var item of loadList) {
    console.log(item.cardRow.sides.A.name,item.cardRow.cardid,cardDbId)
    if (item.cardRow.cardid === cardDbId) {
      return true;
    }
  }  
}

export const arrayMove = (arr, old_index, new_index) => {
  while (old_index < 0) {
      old_index += arr.length;
  }
  while (new_index < 0) {
      new_index += arr.length;
  }
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

export const processLoadList = (loadList, playerN) => {
  var newLoadList = [...loadList];
  var n = newLoadList.length;

  for (var i=0; i<n; i++) {
    const item = newLoadList[i];
    if (item.cardRow.sides.A.type === "Contract") {
      newLoadList = arrayMove(newLoadList, i, 0); 
    }
  }

  const loreThurindir = isCardDbIdInLoadList(newLoadList, "12946b30-a231-4074-a524-960365081360");
  n = newLoadList.length;
  if (loreThurindir) {
    for (var i=0; i<n; i++) {
      const item = newLoadList[i];
      if (item.cardRow.sides.A.type == "Side Quest") {
        if (item.quantity > 0) {
          newLoadList[i] = {...item, quantity: item.quantity - 1};
          newLoadList.push({...item, quantity: 1, groupId: playerN+"Play2"})
        }
      }
    }  
  }

  const theOneRing = isCardDbIdInLoadList(newLoadList, "423e9efe-7908-4c04-97bd-f4a826081c9f");
  n = newLoadList.length;
  if (theOneRing) {
    for (var i=0; i<n; i++) {
      const item = newLoadList[i];
      if (item.cardRow.sides.A.traits.includes("Master.")) {
        if (item.quantity > 0) {
          newLoadList[i] = {...item, quantity: item.quantity - 1};
          newLoadList.push({...item, quantity: 1, groupId: playerN+"Play2"})
        }
      }      
      if (item.cardRow.id === "423e9efe-7908-4c04-97bd-f4a826081c9f") {
        newLoadList[i] = {...item, groupId: playerN+"Play2"};
      }
    }  
  } 

  const glitteringCaves = isCardDbIdInLoadList(loadList, "03a074ce-d581-4672-b6ea-ed97b7afd415");
  n = newLoadList.length;
  if (glitteringCaves) {
    const extraNum = [1,1,1,1,2,2,2,2,3,3,3,3];
    const shuffledExtraNum = shuffle(extraNum);
    var e = 0;
    for (var i=0; i<n; i++) {
      const item = newLoadList[i];
      if (item.cardRow.cardencounterset === "Caves Map") {
        if (e < shuffledExtraNum.length) {
          newLoadList[i] = {...item, groupId: "sharedExtra"+shuffledExtraNum[e]};
          e = e + 1;
        }
      }
    }  
  } 

  return newLoadList; 

}

export const processPostLoad = (loadList, playerN, gameBroadcast, chatBroadcast) => {
  const tacticsEowyn = isCardDbIdInLoadList(loadList, "6dc19efc-af54-4eff-b9ee-ee45e9fd4072")
  if (tacticsEowyn) {
    gameBroadcast("game_action", {action: "increment_threat", options: {increment: -3}})
    chatBroadcast("game_update", {message: "reduced threat by 3."});
  }
  const glitteringCaves = isCardDbIdInLoadList(loadList, "03a074ce-d581-4672-b6ea-ed97b7afd415");
  if (glitteringCaves) {
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "layout", "extra"]]}});
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: "sharedExtra1"}})
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: "sharedExtra2"}})
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: "sharedExtra3"}})
  }
}



