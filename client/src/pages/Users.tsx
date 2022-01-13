import React from "react";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { NavLink } from "react-router-dom";

interface User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
}

const Users = () => {
  const { data: usersData, isPending, error } = useFetch("/users");

  return (
    <div className="users-display">
      <h2>Users (limited to 50)({usersData ? usersData.rowCount : 0})</h2>
      {isPending && <p>Loading users...</p>}
      {error && error}
      {usersData &&
        usersData.rows.map((user: User) => {
          return (
            <p className="link" key={user.id.toString()}>
              <NavLink to={"/profile/" + user.id.toString()}>
                {user.first_name + " " + user.last_name}
              </NavLink>
            </p>
          );
        })}
    </div>
  );
};

export default Users;
