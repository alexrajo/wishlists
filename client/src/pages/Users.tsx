import React from "react";
import { useState, useEffect } from "react";

const Users = () => {

    const [users, setUsers] = useState<Array<any>>([]);
    const [userAmount, setUserAmount] = useState<number>(0);
    const [error, setError] = useState<String | null>();
    const [isPending, setIsPending] = useState<boolean>(true);
    
    useEffect(() => {
        setIsPending(true);
        setError(null);
        fetch("/users").then(res => {
            if (!res.ok) {
                throw Error("Could not load data. " + res.statusText);
            }
            return res.json();
        }).then(u => {
            setUserAmount(u.rowCount);
            setUsers(u.rows);
        }).catch(err => {
            setError(err.message);
        }).finally(() => {
            setIsPending(false);
        });
    }, []);

    return (
        <div className="users-display">
            <h2>Users ({ userAmount })</h2>
            {isPending && <p>Loading users...</p>}
            {error && error}
            {users.map((user: any) => <p>{user.first_name + " " + user.last_name}</p>)}
        </div>
    );
}

export default Users;