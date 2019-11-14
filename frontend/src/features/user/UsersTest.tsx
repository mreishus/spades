import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUsers, addUser, fetchUsers } from "./usersSlice";
//import { setUsers, addUser, fetchUsers, goToUsersThunk } from "./usersSlice";
//import { push } from "connected-react-router";

import { RootState } from "../../rootReducer";

export const Users = () => {
  const dispatch = useDispatch();
  const setUsersC = useCallback(() => {
    dispatch(setUsers(["u1", "u2", "u3"]));
  }, [dispatch]);

  const addUserC = useCallback(() => {
    dispatch(addUser("u99"));
  }, [dispatch]);

  const fetchUsersC = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  /*
  const goToUsers = useCallback(() => {
    dispatch(push("/users"));
  }, [dispatch]);

  const goToUsersViaThunk = useCallback(() => {
    dispatch(goToUsersThunk());
  }, [dispatch]);
   */

  const isLoading = useSelector((state: RootState) => state.users.isLoading);
  const users = useSelector((state: RootState) => state.users.users);

  return (
    <div>
      Users
      <div className="mt-4">
        <button onClick={setUsersC} className="btn btn-primary">
          Set Users to "u1", "u2", "u3"
        </button>
      </div>
      <div className="mt-4">
        <button onClick={addUserC} className="btn btn-primary">
          Add "u99" user
        </button>
      </div>
      <div className="mt-4">
        <button onClick={fetchUsersC} className="btn btn-primary">
          Fetch Users from API
        </button>
      </div>
      <div className="mt-4">
        Loading:
        {isLoading ? "True" : "False"}
        <br />
        Users:
        <pre>{JSON.stringify(users)}</pre>
      </div>
      {/*
      <div className="mt-4">
        <button onClick={goToUsers} className="btn btn-primary">
          Push client side url using dispatch
        </button>
        <button onClick={goToUsersViaThunk} className="btn btn-gray">
          Push client side url using Thunk
        </button>
      </div>
        */}
    </div>
  );
};

export default Users;
