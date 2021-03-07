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
    increment: state => {
      state.count += 1;
    },
  },
});

export const { setGame, increment } = gameUiSlice.actions;
export default gameUiSlice.reducer;
