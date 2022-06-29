import { createStackNavigator } from "@react-navigation/stack";
import AddFriendPage from "./AddFriendPage";
import FriendInfoDisplay from "./FriendInfoDisplay";
import FriendsOverview from "./FriendsOverview";

const FriendsStack = createStackNavigator();

const FriendsStackNavigator = () => {
    return (
        <FriendsStack.Navigator initialRouteName="Overview" screenOptions={{headerShown: false}}>
            <FriendsStack.Screen name="Overview" component={FriendsOverview}/>
            <FriendsStack.Screen name="AddFriend" component={AddFriendPage}/>
            <FriendsStack.Screen name="ViewFriend" component={FriendInfoDisplay}/>
        </FriendsStack.Navigator>
    );
}

export default FriendsStackNavigator;