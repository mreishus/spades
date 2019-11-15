import useAuth from "./useAuth";
const useIsLoggedIn = () => {
  const { authToken } = useAuth();
  return authToken != null;
};
export default useIsLoggedIn;
