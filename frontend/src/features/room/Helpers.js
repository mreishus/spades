import { cardDB } from "../../cardDB/cardDB";
import { sectionToLoadGroupId, sectionToDiscardGroupId } from "./Constants";
import axios from "axios";

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

export const getVisibleFaceSRC = (card, playerN, user) => {
  if (!card) return "";
  const visibleSide = getVisibleSide(card, playerN);
  const visibleFace = getVisibleFace(card, playerN);
  if (visibleSide === "A") {
    return visibleFace.customImgUrl || process.env.PUBLIC_URL + '/images/cards/' + card['cardDbId'] + '.jpg';
  } else { // Side B logic
    const sideBName = card.sides.B.name;
    if (sideBName === "player") {
      return (user?.player_back_url ? user.player_back_url : process.env.PUBLIC_URL + '/images/cardbacks/player.jpg')
    } else if (sideBName === "encounter") {
        return (user?.encounter_back_url ? user.encounter_back_url : process.env.PUBLIC_URL + '/images/cardbacks/encounter.jpg')
    } else if (sideBName) {
        return visibleFace.customImgUrl || process.env.PUBLIC_URL + '/images/cards/' + card['cardDbId'] + '.B.jpg';
    } else {
        return '';
    }
  }
}

export const usesThreatToken = (card) => {
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

export const getCardRowCategory = (cardRow) => {
  if (cardRow.sides.A.type === "Quest") return "Quest";
  if (cardRow.sides.B.name === "encounter") return "Encounter";
  if (cardRow.sides.B.name === "player") return "Player";
  if (cardRow.cardencounterset) return "Encounter";
  return "Player";
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

export const passesCriterion = (card, obj, criterion) => {
  if (card === null || obj === null || criterion === null) return false;
  if (criterion.length === 0) return false;
  if (criterion.length === 1) return obj === criterion[0];
  var par = criterion[0];
  if (par === "sideUp") par = card["currentSide"];
  if (par === "sideDown") par = card["currentSide"] === "A" ? "B" : "A";
  if (criterion.length > 1) return passesCriterion(card, obj[par], criterion.slice(1))
  return false;
}

export const passesCriteria = (card, criteria) => {
  for (var criterion of criteria) {
    if (!passesCriterion(card, card, criterion)) return false;
  }
  return true;
}

const listOfMatchingCards = (gameUi, criteria) => {
  const allCards = flatListOfCards(gameUi.game);
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

const moveCardInLoadList = (loadList, cardDbId, groupId) => {
  for (var i=0; i<loadList.length; i++) {
    const item = loadList[i];
    if (item.cardRow.cardid === cardDbId) {
      if (item.quantity > 0) {
        loadList[i] = {...item, quantity: item.quantity - 1};
        loadList.push({...item, quantity: 1, groupId: groupId})
        return;
      }
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

export const flattenLoadList = (loadList) => {
  // Takes a load list where elements might have a quantity>1 property and splits them into elements with quantity=1
  const n = loadList.length;
  for (var i=0; i<n; i++) {
    const item = loadList[i];
    const quantity = item.quantity;
    if (quantity > 1) {
      for (var j=0; j<(quantity-1); j++) {
        loadList[i] = {...item, quantity: item.quantity - 1};
        loadList.push({...item, quantity: 1})
      }
    }
  }
}

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
      if (item.cardRow.sides.A.type == "Side Quest" && item.groupId.includes("player") && item.groupId.includes("Deck")) {
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
  const wainriders = isCardDbIdInLoadList(loadList, "21165a65-1296-4664-a880-d85eea19a4ae");
  if (wainriders) {
    moveCardInLoadList(newLoadList,"b7f25c2a-b9f1-4ec7-8ab3-4843aaef4e06","sharedExtra1"); // 1
    moveCardInLoadList(newLoadList,"21165a65-1296-4664-a880-d85eea19a4ae","sharedExtra1"); // 6
    moveCardInLoadList(newLoadList,"727b90c5-46b3-4568-9ab9-cb7c6e662428","sharedExtra1"); // Objective
    moveCardInLoadList(newLoadList,"c2ff668a-6174-47d4-bbab-46f9c91403eb","sharedExtra1"); // Objective
    moveCardInLoadList(newLoadList,"4c1e8a5c-db6b-4d36-8202-bf0960870914","sharedExtra2"); // 2
    moveCardInLoadList(newLoadList,"282bca71-ff04-4447-a4e9-a7e5f70e0083","sharedExtra2"); // 5
    moveCardInLoadList(newLoadList,"29fd0721-10ed-4315-b415-5fadeb010051","sharedExtra3"); // 3
    moveCardInLoadList(newLoadList,"fbfee53c-fec3-4b55-a8b4-c7329f8f973e","sharedExtra3"); // 4
  }

  const templeOfTheDeceived = isCardDbIdInLoadList(loadList, "fb7d55c5-7198-45c5-97d7-be4c6a26fa68");
  if (templeOfTheDeceived) {
    flattenLoadList(newLoadList);
    n = newLoadList.length;
    // Loop randomly over array
    const accessOrder = shuffle([...Array(n).keys()]);
    // Temples
    var extraNum = [1,2,3];
    var e = 0;
    for (var i of accessOrder) {
      const item = newLoadList[i];
      if (item.cardRow.sides.A.name === "Temple of the Deceived" && item.cardRow.sides.A.type === "Location") {
        if (e < extraNum.length) {
          newLoadList[i] = {...item, quantity: item.quantity - 1};
          newLoadList.push({...item, quantity: 1, groupId: "sharedExtra"+extraNum[e]})
          e = e + 1;
        }
      }
    }
    // Lost Islands
    extraNum = [1,1,1,1,2,2,2,2,3,3,3,3];
    e = 0;
    for (var i of accessOrder) {
      const item = newLoadList[i];
      if (item.cardRow.sides.A.name === "Lost Island" && item.cardRow.sides.A.type === "Location") {
        if (e < extraNum.length) {
          newLoadList[i] = {...item, groupId: "sharedExtra"+extraNum[e]};
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
  const loreFatty = isCardDbIdInLoadList(loadList, "151ba48a-1efd-451e-bba0-b49fa0566596")
  if (loreFatty) {
    gameBroadcast("game_action", {action: "increment_threat", options: {increment: -2}})
    chatBroadcast("game_update", {message: "reduced threat by 2."});
  }
  const glitteringCaves = isCardDbIdInLoadList(loadList, "03a074ce-d581-4672-b6ea-ed97b7afd415");
  if (glitteringCaves) {
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "layout", "extra"]]}});
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: "sharedExtra1"}})
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: "sharedExtra2"}})
    gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: "sharedExtra3"}})
  }
  const wainriders = isCardDbIdInLoadList(loadList, "21165a65-1296-4664-a880-d85eea19a4ae");
  if (wainriders) {
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "layout", "extra"]]}});
  }
  const templeOfTheDeceived = isCardDbIdInLoadList(loadList, "fb7d55c5-7198-45c5-97d7-be4c6a26fa68");
  if (templeOfTheDeceived) {
    gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "layout", "extra"]]}});
    gameBroadcast("game_action", {
      action: "action_on_matching_cards",
      options: {criteria:[["groupId", "sharedExtra1"], ["stackIndex", 0]], action: "flip_card", options: {}
    }});
    gameBroadcast("game_action", {
      action: "action_on_matching_cards",
      options: {criteria:[["groupId", "sharedExtra3"], ["stackIndex", 0]], action: "flip_card", options: {}
    }});
  }
}

export const loadDeckFromXmlText = (xmlText, playerN, gameBroadcast, chatBroadcast, privacyType) => {
  // TODO: combine duplicate code with TopBarMenu
  var parseString = require('xml2js').parseString;
  parseString(xmlText, function (err, deckJSON) {
    if (!deckJSON) return;
    const sections = deckJSON.deck.section;

    var containsPlaytest = false;
    sections.forEach(section => {
      const cards = section.card;
      if (!cards) return;
      cards.forEach(card => {
        console.log("loadcard", card)
        const cardDbId = card['$'].id;
        var cardRow = cardDB[cardDbId];
        if (cardRow && cardRow["playtest"]) {
          containsPlaytest = true;
        }
      })
    })
    if (containsPlaytest && privacyType === "public"){
      alert("Cannot load a deck containing playtest cards in a public room.")
      return;
    }

    var loadList = [];
    sections.forEach(section => {
      const sectionName = section['$'].name;
      const cards = section.card;
      if (!cards) return;
      cards.forEach(card => {
        const cardDbId = card['$'].id;
        const quantity = parseInt(card['$'].qty);
        var cardRow = cardDB[cardDbId];
        if (cardRow) {
          const loadGroupId = sectionToLoadGroupId(sectionName,playerN);
          cardRow['loadgroupid'] = loadGroupId;
          cardRow['discardgroupid'] = sectionToDiscardGroupId(sectionName,playerN);
          if (cardRow['sides']['A']['keywords'].includes("Encounter")) cardRow['discardgroupid'] = "sharedEncounterDiscard";
          loadList.push({'cardRow': cardRow, 'quantity': quantity, 'groupId': loadGroupId})
        }
        else {
          alert("Encountered unknown card ID for "+card["_"])
        }
      })
    })
    // Automate certain things after you load a deck, like Eowyn, Thurindir, etc.
    loadList = processLoadList(loadList, playerN);
    console.log("loadList", loadList);
    gameBroadcast("game_action", {action: "load_cards", options: {load_list: loadList}});
    chatBroadcast("game_update",{message: "loaded a deck."});
    processPostLoad(loadList, playerN, gameBroadcast, chatBroadcast);
  })
}

export const checkAlerts = async () => {
  const res = await axios.get("/be/api/v1/alerts");
  if (res.data && res.data.message) {
      alert(res.data.message + " Time remaining: "+res.data.minutes_remaining + " minutes");
  }
}


export const getDefault = (card, groupId, groupType, cardIndex) => {
  if (!card) return;
  const face = getCurrentFace(card);
  const type = face.type;
  if (groupType === "hand") {
    return;
  } else if (card.rotation === -30 && card.currentSide === "B") {
    return {title: "flip", action: "flip"};
  } else if (card.rotation === -30 && card.currentSide === "A") {
    return {title: "discard", action: "discard"};
  } else if (groupType === "deck") {
    return {title: "shuffle", action: "shuffle_into_deck"};
  } else if (type === "Quest" && card.currentSide === "A") {
    return {title: "flip", action: "flip"};
  } else if (type === "Quest" && card.tokens.progress < face.questPoints) {
    return {title: "progress", action: "increment_token", options: {tokenType: "progress", increment: 1}};
  } else if (type === "Quest" && card.tokens.progress >= face.questPoints) {
    return {title: "discard", action: "discard"};
  } else if (card.currentSide === "B" && groupType === "play") {
    return {title: "flip", action: "flip"};
  } else if (type === "Enemy" && card.tokens.damage < face.hitPoints) {
    return {title: "damage", action: "increment_token", options: {tokenType: "damage", increment: 1}};
  } else if (type === "Enemy" && card.tokens.damage >= face.hitPoints) {
    return {title: "discard", action: "discard"};
  } else if (type === "Treachery") {
    return {title: "discard", action: "discard"};
  } else if (type === "Location" && card.tokens.progress < face.questPoints) {
    return {title: "progress", action: "increment_token", options: {tokenType: "progress", increment: 1}};
  } else if (type === "Location" && card.tokens.progress >= face.questPoints) {
    return {title: "discard", action: "discard"};
  } else if (type === "Event") {
    return {title: "discard", action: "discard"};
  } else if (card.exhausted) {
    return {title: "ready", action: "toggle_exhaust"};
  } else if (!card.exhausted) {
    return {title: "exhaust", action: "toggle_exhaust"};
  } 
}

export const getScore = (gameUi, gameBroadcast, chatBroadcast) => {
  var heroCards = [];
  heroCards = heroCards.concat(listOfMatchingCards(gameUi, [["sides","A","type","Hero"], ["groupId","player1Discard"]]))
  heroCards = heroCards.concat(listOfMatchingCards(gameUi, [["sides","A","type","Hero"], ["groupId","player2Discard"]]))
  heroCards = heroCards.concat(listOfMatchingCards(gameUi, [["sides","A","type","Hero"], ["groupId","player3Discard"]]))
  heroCards = heroCards.concat(listOfMatchingCards(gameUi, [["sides","A","type","Hero"], ["groupId","player4Discard"]]))
  var fallenHeroCost = 0;
  for (var card of heroCards) {
    fallenHeroCost += card.sides.A.cost;
  }
  chatBroadcast("game_update",{message: "calculated cost of fallen heroes: " + fallenHeroCost});
  const playerData = gameUi.game.playerData;
  const sumThreat = playerData.player1.threat + playerData.player2.threat + playerData.player3.threat + playerData.player4.threat;
  chatBroadcast("game_update",{message: "calculated sum of threat: " + sumThreat});
  const numRounds = Math.max(gameUi.game.roundNumber-1,0);
  chatBroadcast("game_update",{message: "calculated number of completed rounds: " + numRounds});
  var victoryPoints = 0;
  const victoryCards = listOfMatchingCards(gameUi, [["groupId","sharedVictory"]])
  for (var card of victoryCards) {
    victoryPoints += card.sides.A.victoryPoints;
  }
  chatBroadcast("game_update",{message: "calculated total victory points: " + victoryPoints});
  return fallenHeroCost + sumThreat + numRounds*10 - victoryPoints;
}