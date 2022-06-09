import { useEffect, useState } from "react";

const useFetch = (req?: RequestInfo) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<String|null>(null);
    const [data, setData] = useState<any>(null); //Change type from any
    const [statusCode, setStatusCode] = useState<number>();

    const doFetch = () => {
        if (!req) return;

        setIsPending(true);
        setError(null);
        fetch(req)
        .then(res => {
            setStatusCode(res.status);
            if (!res.ok) {
                throw Error("Could not load data. " + res.statusText);
            }
            return res;
        })
        .then(res => res.json())
        .then(content => {
            setData(content);
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setIsPending(false);
        });
    }

    useEffect(doFetch, [req]);

    return {data, isPending, error, statusCode, doFetch};
}

export default useFetch;