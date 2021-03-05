import { combineReducers } from "@reduxjs/toolkit";
import users from "./features/user/usersSlice";
import game from "./features/room/gameSlice";

const rootReducer = combineReducers({
  users, game
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
