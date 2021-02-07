export const playerBackSRC = "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/cards/card.jpg";
export const encounterBackSRC = "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/cards/encounter.jpg";
export const CARDSCALE = 4.5;
export const GROUPSINFO = {
    "gSharedQuestDeck": {name: "Quest Deck"},
    "gSharedQuestDiscard": {name: "Quest Discard Pile"},
    "gSharedEncounterDeck": {name: "Encounter Deck"},
    "gSharedEncounterDiscard": {name: "Encounter Discard"},
    "gSharedQuestDeck2": {name: "Secondary Quest Deck"},
    "gSharedQuestDiscard2": {name: "Second Quest Discard Pile"},
    "gSharedEncounterDeck2": {name: "Second Encounter Deck"},
    "gSharedEncounterDiscard2": {name: "Second Encounter Discard Pile"},
    "gSharedEncounterDeck3": {name: "Third Encounter Deck"},
    "gSharedEncounterDiscard3": {name: "Third Encounter Discard Pile"},
    "gSharedOther": {name: "Other"},
    "gSharedSetAside": {name: "Set Aside"},
    "gSharedVictory": {name: "Victory Display"},
    "gSharedStaging": {name: "Staging Area"},
    "gSharedActive": {name: "Active Location"},
    "gSharedMainQuest": {name: "Main Quest"},
    "gSharedExtra1": {name: "Extra 1"},
    "gSharedExtra2": {name: "Extra 2"},
    "gSharedExtra3": {name: "Extra 3"},
    "gPlayer1Hand": {name: "Player 1 Hand"},
    "gPlayer1Deck": {name: "Player 1 Deck"},
    "gPlayer1Discard": {name: "Player 1 Discard Pile"},
    "gPlayer1Sideboard": {name: "Player 1 Sideboard"},
    "gPlayer1Play1": {name: "Player 1 Play Area"},
    "gPlayer1Play2": {name: "Player 1 Play Area"},
    "gPlayer1Engaged": {name: "Player 1 Engaged Area"},
    "gPlayer1Event": {name: "Player 1 Current Event"},
    "gPlayer2Hand": {name: "Player 2 Hand"},
    "gPlayer2Deck": {name: "Player 2 Deck"},
    "gPlayer2Discard": {name: "Player 2 Discard Pile"},
    "gPlayer2Sideboard": {name: "Player 2 Sideboard"},
    "gPlayer2Play1": {name: "Player 2 Play Area"},
    "gPlayer2Play2": {name: "Player 2 Play Area"},
    "gPlayer2Engaged": {name: "Player 2 Engaged Area"},
    "gPlayer2Event": {name: "Player 2 Current Event"},
    "gPlayer3Hand": {name: "Player 3 Hand"},
    "gPlayer3Deck": {name: "Player 3 Deck"},
    "gPlayer3Discard": {name: "Player 3 Discard Pile"},
    "gPlayer3Sideboard": {name: "Player 3 Sideboard"},
    "gPlayer3Play1": {name: "Player 3 Play Area"},
    "gPlayer3Play2": {name: "Player 3 Play Area"},
    "gPlayer3Engaged": {name: "Player 3 Engaged Area"},
    "gPlayer3Event": {name: "Player 3 Current Event"},
    "gPlayer4Hand": {name: "Player 4 Hand"},
    "gPlayer4Deck": {name: "Player 4 Deck"},
    "gPlayer4Discard": {name: "Player 4 Discard Pile"},
    "gPlayer4Sideboard": {name: "Player 4 Sideboard"},
    "gPlayer4Play1": {name: "Player 4 Play Area"},
    "gPlayer4Play2": {name: "Player 4 Play Area"},
    "gPlayer4Engaged": {name: "Player 4 Engaged Area"},
    "gPlayer4Event": {name: "Player 4 Current Event"}
}

export const sectionToGroupID = (section, PlayerN) => {
  switch(section) {
    case 'Hero':
      return 'g'+PlayerN+'Play1';
    case 'Ally':
      return 'g'+PlayerN+'Deck';
    case 'Attachment':
      return 'g'+PlayerN+'Deck';
    case 'Event':
      return 'g'+PlayerN+'Deck';
    case 'Side Quest':
      return 'g'+PlayerN+'Deck';
    case 'Sideboard':
      return 'g'+PlayerN+'Sideboard';
    case 'Quest':
      return 'gSharedQuestDeck';
    case 'Encounter':
      return 'gSharedEncounterDeck';
    case 'Special':
      return 'gSharedEncounterDeck2';
    case 'Second Special':
      return 'gSharedEncounterDeck3';
    case 'Setup':
      return 'gSharedSetAside';
    case 'Staging Setup':
      return 'gSharedStaging';
    case 'Active Setup':
      return 'gSharedActive';
    case 'Second Quest Deck':
      return 'gSharedQuestDeck2';
  }
  return 'gSharedOther';
}

export const sectionToDiscardGroupID = (section, PlayerN) => {
  switch(section) {
    case 'Hero':
      return 'g'+PlayerN+'Discard';
    case 'Ally':
      return 'g'+PlayerN+'Discard';
    case 'Attachment':
      return 'g'+PlayerN+'Discard';
    case 'Event':
      return 'g'+PlayerN+'Discard';
    case 'Side Quest':
      return 'g'+PlayerN+'Discard';
    case 'Sideboard':
      return 'g'+PlayerN+'Discard';
    case 'Quest':
      return 'gSharedQuestDiscard';
    case 'Encounter':
      return 'gSharedEncounterDiscard';
    case 'Special':
      return 'gSharedEncounterDiscard2';
    case 'Second Special':
      return 'gSharedEncounterDiscard3';
    case 'Setup':
      return 'gSharedEncounterDiscard';
    case 'Staging Setup':
      return 'gSharedEncounterDiscard';
    case 'Active Setup':
      return 'gSharedEncounterDiscard';
    case 'Second Quest Deck':
      return 'gSharedQuestDiscard2';
  }
  return 'gSharedOther';
}