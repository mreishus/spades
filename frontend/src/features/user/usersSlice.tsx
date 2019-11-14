import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUsers } from "../../api/getUsers";
import { AppThunk } from "../../store";

interface UsersState {
  users: Array<any>;
  isLoading: boolean;
  error: null | string;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsersStart(state) {
      state.isLoading = true;
    },
    getUsersSuccess(state, { payload }) {
      state.users = payload;
      state.isLoading = false;
      state.error = null;
    },
    getUsersFailure(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
    },
    setUsers(state: UsersState, action: PayloadAction<any>) {
      return {
        ...state,
        users: action.payload
      };
    },
    addUser(state: UsersState, { payload }: PayloadAction<any>) {
      state.users.push(payload);
    }
  }
});

export const {
  setUsers,
  addUser,
  getUsersStart,
  getUsersSuccess,
  getUsersFailure
} = usersSlice.actions;

export default usersSlice.reducer;

//////////////
/// THUNKS ///
//////////////

export const fetchUsers = (): AppThunk => async dispatch => {
  try {
    dispatch(getUsersStart());
    const users = await getUsers();
    dispatch(getUsersSuccess(users));
  } catch (err) {
    dispatch(getUsersFailure(err.toString()));
  }
};
