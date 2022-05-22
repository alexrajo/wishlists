import { useEffect, useState } from "react";

const api_endpoint = process.env.API_ENDPOINT || "http://localhost:3001";

const useFetch = (url: RequestInfo) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<String|null>(null);
    const [data, setData] = useState<any>(null); //Change type from any

    useEffect(() => {
        setIsPending(true);
        setError(null);
        fetch(api_endpoint + url)
        .then(res => {
            if (!res.ok) {
                throw Error("Could not load data. " + res.statusText);
            }
            console.log(res);
            return res;
        })
        .then(res => res.json())
        .then(formattedData => {
            setData(formattedData);
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setIsPending(false);
        });
    }, [url]);

    return {data, isPending, error};
}

export default useFetch;