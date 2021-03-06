import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  "firstPlayer": "player1",
  "groupsById": {
    "gPlayer2Play2": {
      "controller": "player2",
      "stackIds": [],
      "type": "play"
    },
    "gSharedQuestDeck": {
      "controller": "shared",
      "stackIds": [],
      "type": "deck"
    },
    "gPlayer3Engaged": {
      "controller": "player3",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer4Event": {
      "controller": "player4",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer2Play1": {
      "controller": "player2",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer2Hand": {
      "controller": "player2",
      "stackIds": [],
      "type": "hand"
    },
    "gPlayer4Play2": {
      "controller": "player4",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer1Hand": {
      "controller": "player1",
      "stackIds": [],
      "type": "hand"
    },
    "gPlayer1Sideboard": {
      "controller": "player1",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedEncounterDeck": {
      "controller": "shared",
      "stackIds": [],
      "type": "deck"
    },
    "gPlayer3Sideboard": {
      "controller": "player3",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedEncounterDeck3": {
      "controller": "shared",
      "stackIds": [],
      "type": "deck"
    },
    "gPlayer1Engaged": {
      "controller": "player1",
      "stackIds": [],
      "type": "play"
    },
    "gSharedMainQuest": {
      "controller": "shared",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer1Play2": {
      "controller": "player1",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer4Play1": {
      "controller": "player4",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer3Hand": {
      "controller": "player3",
      "stackIds": [],
      "type": "hand"
    },
    "gPlayer1Play1": {
      "controller": "player1",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer3Discard": {
      "controller": "player3",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer2Event": {
      "controller": "player2",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedEncounterDiscard3": {
      "controller": "shared",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedActive": {
      "controller": "shared",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer3Play1": {
      "controller": "player3",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer2Deck": {
      "controller": "player2",
      "stackIds": [],
      "type": "deck"
    },
    "gPlayer4Engaged": {
      "controller": "player4",
      "stackIds": [],
      "type": "play"
    },
    "gSharedQuestDiscard2": {
      "controller": "shared",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer1Event": {
      "controller": "player1",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedExtra1": {
      "controller": "shared",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer4Sideboard": {
      "controller": "player4",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedStaging": {
      "controller": "shared",
      "stackIds": [],
      "type": "play"
    },
    "gSharedSetAside": {
      "controller": "shared",
      "stackIds": [],
      "type": "hand"
    },
    "gPlayer2Discard": {
      "controller": "player2",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer4Discard": {
      "controller": "player4",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer3Deck": {
      "controller": "player3",
      "stackIds": [],
      "type": "deck"
    },
    "gSharedQuestDeck2": {
      "controller": "shared",
      "stackIds": [],
      "type": "hand"
    },
    "gSharedEncounterDeck2": {
      "controller": "shared",
      "stackIds": [],
      "type": "deck"
    },
    "gPlayer1Discard": {
      "controller": "player1",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer4Deck": {
      "controller": "player4",
      "stackIds": [],
      "type": "deck"
    },
    "gPlayer3Play2": {
      "controller": "player3",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer4Hand": {
      "controller": "player4",
      "stackIds": [],
      "type": "hand"
    },
    "gSharedExtra3": {
      "controller": "shared",
      "stackIds": [],
      "type": "play"
    },
    "gPlayer2Engaged": {
      "controller": "player2",
      "stackIds": [],
      "type": "play"
    },
    "gSharedQuestDiscard": {
      "controller": "shared",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedVictory": {
      "controller": "shared",
      "stackIds": [],
      "type": "hand"
    },
    "gPlayer1Deck": {
      "controller": "player1",
      "stackIds": [],
      "type": "deck"
    },
    "gSharedExtra2": {
      "controller": "shared",
      "stackIds": [],
      "type": "play"
    },
    "gSharedEncounterDiscard2": {
      "controller": "shared",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedEncounterDiscard": {
      "controller": "shared",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer3Event": {
      "controller": "player3",
      "stackIds": [],
      "type": "discard"
    },
    "gPlayer2Sideboard": {
      "controller": "player2",
      "stackIds": [],
      "type": "discard"
    },
    "gSharedOther": {
      "controller": "shared",
      "stackIds": [],
      "type": "hand"
    }
  },
  "stacksById": {},
  "cardsById": {},
  "options": {
    "hardcodedCards": null
  },
  "phase": "pBeginning",
  "playersById": {
    "player1": {
      "cardsDrawnDuringResource": 1,
      "eliminated": false,
      "threat": 0,
      "willpower": 0
    },
    "player2": {
      "cardsDrawnDuringResource": 1,
      "eliminated": false,
      "threat": 0,
      "willpower": 0
    },
    "player3": {
      "cardsDrawnDuringResource": 1,
      "eliminated": false,
      "threat": 0,
      "willpower": 0
    },
    "player4": {
      "cardsDrawnDuringResource": 1,
      "eliminated": false,
      "threat": 0,
      "willpower": 0
    }
  },
  "roundNumber": 0,
  "roundStep": "0.0"
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame(state, { payload }) {
      state["firstPlayer"] = payload;
    },
  },
});

export const { setGame } = gameSlice.actions;
export default gameSlice.reducer;
