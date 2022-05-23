import { StatusBar, SafeAreaView, Text } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import TabNavigation from "./TabNavigation";
import LoginScreen from "./screens/LoginScreen";

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    return (
        <div>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="LoginScreen" component={LoginScreen}/>
                    <Stack.Screen name="Main" component={TabNavigation}/>
                </Stack.Navigator>
            </NavigationContainer>
        </div>
    );
}

export default StackNavigation;