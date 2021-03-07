import { combineReducers } from "@reduxjs/toolkit";
import users from "./features/user/usersSlice";
import gameUi from "./features/room/gameUiSlice";

const rootReducer = combineReducers({
  users, gameUi
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
