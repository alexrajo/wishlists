import React from "react";
import WishlistPreview from "../components/WishlistPreview";

interface Props {
  wishlists: Array<any>
}

const WishlistsContainer = (props: Props) => {

  const wishlists = props.wishlists;

  return (
    <div className="wishlists-page-container">
      <h2>Wishlists</h2>
      {wishlists.length > 0 ? wishlists.map(list => {
        return <WishlistPreview name={list.creator_id} title={list.title} description={list.description}/>
      }) : <p>Could not find any wishlists.</p>}
    </div>
  );
};

export default WishlistsContainer;
