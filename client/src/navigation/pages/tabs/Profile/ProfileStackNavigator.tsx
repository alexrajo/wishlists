import { createStackNavigator } from "@react-navigation/stack";
import { ProvideTopStackNavigator } from "../../../../hooks/useTopStackNavigator";
import ProfileInfoDisplay from "./ProfileInfoDisplay";
import ProfileSettingsPage from "./ProfileSettingsPage";

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = ({navigation}: any) => {
    return (
        <ProvideTopStackNavigator navigation={navigation}>
            <ProfileStack.Navigator initialRouteName="Info" screenOptions={{headerShown: false}}>
                <ProfileStack.Screen name="Info" component={ProfileInfoDisplay}/>
                <ProfileStack.Screen name="Settings" component={ProfileSettingsPage}/>
            </ProfileStack.Navigator>
        </ProvideTopStackNavigator>
    );
}

export default ProfileStackNavigator;