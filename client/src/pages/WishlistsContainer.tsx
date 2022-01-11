import React from "react";
import WishlistPreview from "../components/WishlistPreview";

const WishlistsContainer = () => {

  return (
    <div className="wishlists-page-container">
      <h2>Wishlists</h2>
      <WishlistPreview name="Emilie"/>
    </div>
  );
};

export default WishlistsContainer;
