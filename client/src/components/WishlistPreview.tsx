import React from "react";

interface Props{
    name: String,
    title: String,
    description: String
}

const WishlistPreview = (props: Props) => {
  return (
    <div className="wishlist-list-container">
      <div>
        <h3>{props.title}</h3>
        <p>{props.name}</p>
        <br />
        <p>{props.description}</p>
        <p>Last updated: 10.12.2021</p>
      </div>
    </div>
  );
};

export default WishlistPreview;
