import React from "react";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { NavLink } from "react-router-dom";

interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

const Users = () => {
  const { data: usersData, isPending, error } = useFetch("/api/users");

  return (
    <div className="users-display">
      <h2>Users (limited to 50)({usersData ? usersData.length : 0})</h2>
      {isPending && <p>Loading users...</p>}
      {error && error}
      {usersData &&
        usersData.map((user: User) => {
          return (
            <p className="link" key={user.id.toString()}>
              <NavLink to={"/profile/" + user.id.toString()}>
                {user.firstName + " " + user.lastName}
              </NavLink>
            </p>
          );
        })}
    </div>
  );
};

export default Users;
