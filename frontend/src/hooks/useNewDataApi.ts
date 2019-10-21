import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const useNewDataApi = (initialUrl: string, initialData: any) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl); // Mechanism to refetch by changing url
  const [hash, setHash] = useState<any>(null); // Mechanism to refrech same url, by changing hash
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { authToken, renewToken, setAuthToken, setRenewToken } = useAuth();
  const authOptions = useMemo(
    () => ({
      headers: {
        Authorization: authToken
      }
    }),
    [authToken]
  );
  const renewOptions = useMemo(
    () => ({
      headers: {
        Authorization: renewToken
      }
    }),
    [renewToken]
  );

  const intercept_error = useCallback(
    (error: any) => {
      console.log("In interceptor");
      const originalRequest = error.config;
      const renewUrl = "/be/api/v1/session/renew";
      if (
        originalRequest._retry ||
        error.response.status !== 401 ||
        originalRequest.url === renewUrl
      ) {
        console.log("Interceptor: Not doing work");
        return Promise.reject(error);
      }

      console.log("Interceptor: Doing work");
      console.log(originalRequest);

      originalRequest._retry = true;
      console.log("+++ Interceptor trying to renew");
      return axios.post(renewUrl, null, renewOptions).then(res => {
        console.log("+++ After renew");
        console.log(res);
        if (res.status === 200) {
          console.log("+++!!! Got 201, here's data");
          console.log(res.data);
          console.log(res.data.data.renew_token);
          console.log(res.data.data.token);

          setRenewToken(res.data.data.renew_token);
          setAuthToken(res.data.data.token);

          return axios(originalRequest);
        }
      });
    },
    [renewOptions, setAuthToken, setRenewToken]
  );

  useEffect(() => {
    const fetchData = async () => {
      const id = (response: any) => response;
      setIsError(false);
      setIsLoading(true);

      const an_axios = axios.create();
      an_axios.interceptors.response.use(id, intercept_error);
      try {
        const result = await an_axios(url, authOptions);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [url, hash, authOptions, intercept_error]);
  return {
    data,
    isLoading,
    isError,
    doFetchUrl: setUrl,
    doFetchHash: setHash,
    setData // Override what was fetched by the API (For example, websocket updates)
  };
};

export default useNewDataApi;
