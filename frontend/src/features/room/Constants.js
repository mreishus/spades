export const playerBackSRC = "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/cards/card.jpg";
export const encounterBackSRC = "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/cards/encounter.jpg";
export const CARDSCALE = 4.5;
export const GROUPSINFO = {
    "gSharedEncounterDeck": {name: "Encounter Deck", tablename: "Encounter Deck"},
    "gSharedEncounterDiscard": {name: "Encounter Discard", tablename: "Encounter Discard"},
    "gSharedQuestDeck": {name: "Quest Deck", tablename: "Quest Deck"},
    "gSharedQuestDiscard": {name: "Quest Discard", tablename: "Quest Discard"},
    "gSharedQuestDeck2": {name: "Second Quest Deck", tablename: "Second Quest Deck"},
    "gSharedQuestDiscard2": {name: "Second Quest Discard", tablename: "Second Quest Discard"},
    "gSharedEncounterDeck2": {name: "Second Encounter Deck", tablename: "Second Encounter Deck"},
    "gSharedEncounterDiscard2": {name: "Second Encounter Discard", tablename: "Second Encounter Discard"},
    "gSharedEncounterDeck3": {name: "Third Encounter Deck", tablename: "Third Encounter Deck"},
    "gSharedEncounterDiscard3": {name: "Third Encounter Discard", tablename: "Third Encounter Discard"},
    "gSharedOther": {name: "Other", tablename: "Other"},
    "gSharedSetAside": {name: "Set Aside", tablename: "Set Aside"},
    "gSharedVictory": {name: "Victory Display", tablename: "Victory Display"},
    "gSharedStaging": {name: "Staging Area", tablename: "Staging Area"},
    "gSharedActive": {name: "Active Location", tablename: "Active Location"},
    "gSharedMainQuest": {name: "Main Quest", tablename: "Main Quest"},
    "gSharedExtra1": {name: "Extra 1", tablename: "Extra 1"},
    "gSharedExtra2": {name: "Extra 2", tablename: "Extra 2"},
    "gSharedExtra3": {name: "Extra 3", tablename: "Extra 3"},
    "gPlayer1Hand": {name: "Player 1 Hand", tablename: "Player 1 Hand"},
    "gPlayer1Deck": {name: "Player 1 Deck", tablename: "Deck"},
    "gPlayer1Discard": {name: "Player 1 Discard", tablename: "Discard"},
    "gPlayer1Sideboard": {name: "Player 1 Sideboard", tablename: "Player 1 Sideboard"},
    "gPlayer1Play1": {name: "Player 1 Play Area 1", tablename: "Play Area"},
    "gPlayer1Play2": {name: "Player 1 Play Area 2", tablename: "Play Area"},
    "gPlayer1Engaged": {name: "Player 1 Engaged Area", tablename: "Engaged Area"},
    "gPlayer1Event": {name: "Player 1 Current Event", tablename: "Current Event"},
    "gPlayer2Hand": {name: "Player 2 Hand", tablename: "Player 2 Hand"},
    "gPlayer2Deck": {name: "Player 2 Deck", tablename: "Deck"},
    "gPlayer2Discard": {name: "Player 2 Discard", tablename: "Discard"},
    "gPlayer2Sideboard": {name: "Player 2 Sideboard", tablename: "Player 2 Sideboard"},
    "gPlayer2Play1": {name: "Player 2 Play Area 1", tablename: "Play Area"},
    "gPlayer2Play2": {name: "Player 2 Play Area 2", tablename: "Play Area"},
    "gPlayer2Engaged": {name: "Player 2 Engaged Area", tablename: "Engaged Area"},
    "gPlayer2Event": {name: "Player 2 Current Event", tablename: "Current Event"},
    "gPlayer3Hand": {name: "Player 3 Hand", tablename: "Player 3 Hand"},
    "gPlayer3Deck": {name: "Player 3 Deck", tablename: "Deck"},
    "gPlayer3Discard": {name: "Player 3 Discard", tablename: "Discard"},
    "gPlayer3Sideboard": {name: "Player 3 Sideboard", tablename: "Player 3 Sideboard"},
    "gPlayer3Play1": {name: "Player 3 Play Area 1", tablename: "Play Area"},
    "gPlayer3Play2": {name: "Player 3 Play Area 2", tablename: "Play Area"},
    "gPlayer3Engaged": {name: "Player 3 Engaged Area", tablename: "Engaged Area"},
    "gPlayer3Event": {name: "Player 3 Current Event", tablename: "Current Event"},
    "gPlayer4Hand": {name: "Player 4 Hand", tablename: "Player 4 Hand"},
    "gPlayer4Deck": {name: "Player 4 Deck", tablename: "Deck"},
    "gPlayer4Discard": {name: "Player 4 Discard", tablename: "Discard"},
    "gPlayer4Sideboard": {name: "Player 4 Sideboard", tablename: "Player 4 Sideboard"},
    "gPlayer4Play1": {name: "Player 4 Play Area 1", tablename: "Play Area"},
    "gPlayer4Play2": {name: "Player 4 Play Area 2", tablename: "Play Area"},
    "gPlayer4Engaged": {name: "Player 4 Engaged Area", tablename: "Engaged Area"},
    "gPlayer4Event": {name: "Player 4 Current Event", tablename: "Current Event"}
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