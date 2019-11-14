import { combineReducers } from "@reduxjs/toolkit";
import users from "./features/user/usersSlice";

const rootReducer = combineReducers({
  users
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
