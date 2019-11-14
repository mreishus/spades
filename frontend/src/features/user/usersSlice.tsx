import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getUser from "../../api/getUser";
import { AppThunk } from "../../store";
import { AuthContextType } from "../../contexts/AuthContext";
import { User } from "elixir-backend";

interface UsersState {
  usersById: Record<number, any>;
}

const initialState: UsersState = {
  usersById: {}
};

interface SetUserPayload {
  userId: number;
  user: User;
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<SetUserPayload>) {
      const { userId, user } = payload;
      state.usersById[userId] = user;
    }
  }
});

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;

//////////////
/// THUNKS ///
//////////////

export const fetchUser = (
  userId: number,
  authCtx: AuthContextType
): AppThunk => async dispatch => {
  try {
    console.log("Getting users for id: " + userId);
    const user = await getUser(userId, authCtx);
    dispatch(setUser({ userId, user }));
  } catch (err) {
    console.log("Error loading user: ", err);
  }
};
