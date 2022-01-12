import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import defaultProfile from "../assets/images/defaultProfile.svg";

const ProfileDisplay = () => {

    const { id } = useParams();
    const {data: user, isPending, error} = useFetch("/profile/" + id);

    return (
        <div className="profile-display">
            {isPending && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {user &&
                <div className="profile-content-container">
                    <img className="profile-pic" src={defaultProfile} alt="profile-pic"></img>
                    <h2 className="profile-name">{user.first_name + " " + user.last_name}</h2>
                    <h3 className="profile-username">{user.username}</h3>
                    <p>Born {user.date_of_birth.substring(0, 10)}</p>
                </div>
            }
        </div>
    );
}

export default ProfileDisplay;