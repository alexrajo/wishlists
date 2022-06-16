import { createStackNavigator } from "@react-navigation/stack";
import CreateNewListPage from "./CreateNewListPage";
import MyListsOverview from "./MyListsOverview";

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <ProfileStack.Navigator initialRouteName="Overview" screenOptions={{headerShown: false}}>
            <ProfileStack.Screen name="Overview" component={MyListsOverview}/>
            <ProfileStack.Screen name="Create" component={CreateNewListPage}/>
        </ProfileStack.Navigator>
    );
}

export default ProfileStackNavigator;