import { createStackNavigator } from "@react-navigation/stack";
import ProfileInfoDisplay from "./ProfileInfoDisplay";
import ProfileSettingsPage from "./ProfileSettingsPage";

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <ProfileStack.Navigator initialRouteName="Info" screenOptions={{headerShown: false}}>
            <ProfileStack.Screen name="Info" component={ProfileInfoDisplay}/>
            <ProfileStack.Screen name="Settings" component={ProfileSettingsPage}/>
        </ProfileStack.Navigator>
    );
}

export default ProfileStackNavigator;