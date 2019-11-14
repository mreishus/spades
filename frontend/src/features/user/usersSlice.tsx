import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getUsers } from "../../api/getUsers";
import { AppThunk } from "../../store";
import { AuthContextType } from "../../contexts/AuthContext";

interface UsersState {
  usersById: Record<number, any>;
}

const initialState: UsersState = {
  usersById: {}
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<any>) {
      const { userId, user } = payload;
      console.log("Setting users:");
      console.log({ userId, user });
      state.usersById[userId] = user;
      //return state;
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
    console.log("Got users?");
    console.log(user);
    dispatch(setUser({ userId, user }));
  } catch (err) {
    console.log("Error loading user: ", err);
  }
};

const getUser = async (userId: number, authCtx: AuthContextType) => {
  const url = "/be/api/v1/profile/" + userId;
  const result = await apiGet(url, authCtx);
  return result.data.user_profile;
};

const apiGet = async (url: string, authCtx: AuthContextType) => {
  const { authToken } = authCtx;
  const authOptions = {
    headers: {
      Authorization: authToken
    }
  };
  const result = await axios(url, authOptions);
  return result;
};
