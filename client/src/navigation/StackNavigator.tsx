import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/LoginScreen"
import RegisterScreen from "./pages/RegisterScreen";
import LandingScreen from "./pages/LandingScreen";
import TabNavigator from "./pages/TabNavigator";
import { View } from "react-native";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Landing" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Landing" component={LandingScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Tabs" component={TabNavigator}/>
        </Stack.Navigator>
    );
}

export default StackNavigator;