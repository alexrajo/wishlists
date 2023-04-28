import React from "react";
import WishlistsOverview from "../../../../components/WishlistsOverview";
import { StackScreenProps } from "@react-navigation/stack";
import { FriendsStackParamList } from "./FriendsStackNavigator";

type MyListsOverviewProps = StackScreenProps<
  FriendsStackParamList,
  "ViewWishlists"
>;

const MyListsOverview = (props: MyListsOverviewProps) => {
  const { navigation, route } = props;
  return (
    <WishlistsOverview
      navigation={navigation}
      endpoint={`/api/getuserwishlists/${route.params.userId}`}
    />
  );
};

export default MyListsOverview;
