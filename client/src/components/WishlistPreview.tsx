import React from "react";

interface Props{
    name: String
}

const WishlistPreview = (props: Props) => {
  return (
    <div className="wishlist-list-container">
      <div>
        <h3>Julegaver</h3>
        <p>{props.name}</p>
        <br />
        <p>Last updated: 10.12.2021</p>
      </div>
    </div>
  );
};

export default WishlistPreview;
