import { useEffect, useState } from "react";
import useAuth from "./useAuth";

type FetchReturnType<T> = {
  data: T;
  isPending: boolean;
  error: string | undefined;
  statusCode: number | undefined;
  refresh: () => void;
};

const useFetch = <T,>(req?: RequestInfo): FetchReturnType<T> => {
  const { refreshAuthToken } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any>(null); //Change type from any
  const [statusCode, setStatusCode] = useState<number>();

  const doFetch = () => {
    if (req === undefined) return;

    setData(null);
    setIsPending(true);
    setError(undefined);
    setStatusCode(undefined);
    fetch(req)
      .then(async (res) => {
        setStatusCode(res.status);
        if (!res.ok) {
          if (res.status == 401) {
            refreshAuthToken();
          }
          await res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res;
      })
      .then((res) => res.json())
      .then((content) => {
        setData(content);
      })
      .catch((err) => {
        if (statusCode !== undefined && statusCode.toString()[0] !== "2") {
          setError(err.message);
        }
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const refresh = doFetch;
  useEffect(doFetch, [req]);

  return { data, isPending, error, statusCode, refresh };
};

export default useFetch;
