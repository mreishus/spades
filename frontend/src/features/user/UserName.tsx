import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "./usersSlice";
import useAuth from "../../hooks/useAuth";
import { RootState } from "../../rootReducer";

interface Props {
  userId: number | null;
}

export const UserName: React.FC<Props> = ({ userId }) => {
  const dispatch = useDispatch();
  const authContext = useAuth();
  useEffect(() => {
    if (userId == null) {
      return;
    }
    dispatch(fetchUser(userId, authContext));
  }, [authContext, dispatch, userId]);

  const user = useSelector(
    (state: RootState) => state.users.usersById[userId || 0]
  );

  if (userId === null) {
    return null;
  }
  if (user != null) {
    return <span>{user.alias}</span>;
  }
  return <div>user #{userId}</div>;
};
export default UserName;
