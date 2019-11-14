import axios from "axios";
import { AuthContextType } from "../contexts/AuthContext";

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
export default apiGet;
