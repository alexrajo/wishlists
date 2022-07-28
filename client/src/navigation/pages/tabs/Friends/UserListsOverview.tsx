import React from "react";
import WishlistsOverview from "../../../../components/WishlistsOverview";

const MyListsOverview = ({navigation, route}: {navigation: any, route: {params: {userId: number}}}) => (
    <WishlistsOverview navigation={navigation} endpoint={`/api/getuserwishlists/${route.params.userId}`}/>
);

export default MyListsOverview;