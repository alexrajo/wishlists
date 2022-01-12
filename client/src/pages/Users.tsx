import React from "react";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

interface User{
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    date_of_birth: string,
    email: string
}

const Users = () => {

    const {data: usersData, isPending, error} = useFetch("/users");

    return (
        <div className="users-display">
            <h2>Users ({ usersData ? usersData.rowCount : 0 })</h2>
            {isPending && <p>Loading users...</p>}
            {error && error}
            {usersData && usersData.rows.map((user: User) => <p>{user.first_name + " " + user.last_name}</p>)}
        </div>
    );
}

export default Users;