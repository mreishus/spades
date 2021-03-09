import { createSlice } from "@reduxjs/toolkit";

const initialState = {"count": 1};

const gameUiSlice = createSlice({
  name: "gameUi",
  initialState,
  reducers: {
    setGame: (state, { payload }) => {
      console.log("setting game", payload)
      state.game = payload;
    },
    setGroup: (state, { payload }) => {
      console.log("setting group", payload)
      state.game.groupById[payload.id] = payload;
    },
    setStackIds: (state, { payload }) => {
      console.log("setting stack", payload)
      state.game.groupById[payload.id].stackIds = payload.stackIds;
    },
    setStack: (state, { payload }) => {
      console.log("setting stack", payload)
      state.game.stackById[payload.id] = payload;
    },
    setCardIds: (state, { payload }) => {
      console.log("setting stack", payload)
      state.game.stackById[payload.id].cardIds = payload.cardIds;
    },
    setPlayerIds: (state, { payload }) => {
      console.log("setting playerIds", payload)
      state.playerIds = payload;
    },
    increment: state => {
      state.count += 1;
    },
  },
});

export const { setGame, setGroup, setStackIds, setStack, setCardIds, setPlayerIds, increment } = gameUiSlice.actions;
export default gameUiSlice.reducer;
