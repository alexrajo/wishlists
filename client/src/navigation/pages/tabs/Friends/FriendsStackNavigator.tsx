import { createStackNavigator } from "@react-navigation/stack";
import ListViewingPage from "../../ListViewingPage";
import AddFriendPage from "./AddFriendPage";
import FriendInfoDisplay from "./FriendInfoDisplay";
import FriendsOverview from "./FriendsOverview";
import UserListsOverview from "./UserListsOverview";
import { CondensedUser, Wishlist } from "../../../../config/types";

export type FriendsStackParamList = {
  Overview: undefined;
  AddFriend: undefined;
  ViewFriend: {
    profileData: CondensedUser;
    friendshipId: number;
  };
  ViewWishlists: { userId: number };
  ViewList: { wishlist: Wishlist };
};

const FriendsStack = createStackNavigator<FriendsStackParamList>();

const FriendsStackNavigator = () => {
  return (
    <FriendsStack.Navigator
      initialRouteName="Overview"
      screenOptions={{ headerShown: false }}
    >
      <FriendsStack.Screen name="Overview" component={FriendsOverview} />
      <FriendsStack.Screen name="AddFriend" component={AddFriendPage} />
      <FriendsStack.Screen name="ViewFriend" component={FriendInfoDisplay} />
      <FriendsStack.Screen name="ViewWishlists" component={UserListsOverview} />
      <FriendsStack.Screen name="ViewList" component={ListViewingPage} />
    </FriendsStack.Navigator>
  );
};

export default FriendsStackNavigator;
