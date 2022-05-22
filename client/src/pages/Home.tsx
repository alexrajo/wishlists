import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const Home = () => {
    const {data, error, isPending} = useFetch("/api/");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedin, setLoggedin] = useState(false);

    const login = () => {
        fetch("/api/login/", {
            method: "POST", 
            mode: "cors",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => res.json())
        .then(resData => {
            setLoggedin(resData.loggedin);
            console.log(resData.message);
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        if (data) {
            setLoggedin(data.loggedin);
        }
    }, [data])

    return (
    <div>
        <h2>Home</h2>
        {isPending && "Loading..."}
        {error}
        {data &&
            <div>
                <p>{data.message}</p>
                {!loggedin ? 
                    <div>
                        <h3>Log in or register:</h3>
                        <p>Username: <input type="text" value={username} onInput={e => setUsername(e.currentTarget.value)}></input></p>
                        <p>Password: <input type="password" value={password} onInput={e => setPassword(e.currentTarget.value)}></input></p>
                        <button onClick={login}>Log in!</button>
                    </div>
                : <p>You are logged in!</p>}
            </div>
        }
    </div>
    );
}

export default Home;