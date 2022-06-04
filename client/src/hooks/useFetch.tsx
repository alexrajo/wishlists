import { useEffect, useState } from "react";

const useFetch = (url: RequestInfo) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<String|null>(null);
    const [data, setData] = useState<any>(null); //Change type from any

    useEffect(() => {
        setIsPending(true);
        setError(null);
        fetch(url)
        .then(res => {
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
    }, [url]);

    return {data, isPending, error};
}

export default useFetch;