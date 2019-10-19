import { useState, useEffect } from "react";
import axios from "axios";

const useDataApi = (initialUrl: string, initialData: any) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl); // Mechanism to refetch by changing url
  const [hash, setHash] = useState<any>(null); // Mechanism to refrech same url, by changing hash
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(url);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [url, hash]);
  return {
    data,
    isLoading,
    isError,
    doFetchUrl: setUrl,
    doFetchHash: setHash,
    setData // Override what was fetched by the API (For example, websocket updates)
  };
};

export default useDataApi;
