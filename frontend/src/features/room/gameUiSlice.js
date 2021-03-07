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
    setPlayerIds: (state, { payload }) => {
      console.log("setting playerIds", payload)
      state.playerIds = payload;
    },
    increment: state => {
      state.count += 1;
    },
  },
});

export const { setGame, setPlayerIds, increment } = gameUiSlice.actions;
export default gameUiSlice.reducer;
