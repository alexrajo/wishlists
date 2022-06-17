import { createStackNavigator } from "@react-navigation/stack";
import CreateNewListPage from "./CreateNewListPage";
import MyListsOverview from "./MyListsOverview";

const MyListsStack = createStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <MyListsStack.Navigator initialRouteName="Overview" screenOptions={{headerShown: false}}>
            <MyListsStack.Screen name="Overview" component={MyListsOverview}/>
            <MyListsStack.Screen name="Create" component={CreateNewListPage}/>
        </MyListsStack.Navigator>
    );
}

export default ProfileStackNavigator;