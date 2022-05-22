import {useState, useEffect} from "react";

const useFetch = (url: string) => {
    const [data, setData] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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