import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import defaultProfile from "../assets/images/defaultProfile.svg";
import WishlistsContainer from "./WishlistsContainer";

const ProfileDisplay = () => {

    const { id } = useParams();
    const {data: user, isPending: profileIsPending, error: profileError} = useFetch("/profile/" + id);
    const {data: wishlists, isPending: wishlistsPending, error: wishlistsError} = useFetch("/user_wishlists/" + id);

    return (
        <div className="profile-display">
            {profileIsPending && <p>Loading...</p>}
            {profileError && <p>{profileError}</p>}
            {user &&
                <div className="profile-content-container">
                    <img className="profile-pic" src={defaultProfile} alt="profile-pic"></img>
                    <h2 className="profile-name">{user.first_name + " " + user.last_name}</h2>
                    <h3 className="profile-username">{user.username}</h3>
                    <p>Born {user.date_of_birth.substring(0, 10)}</p>
                </div>
            }
            {wishlists && <WishlistsContainer wishlists={wishlists}/>}
        </div>
    );
}

export default ProfileDisplay;