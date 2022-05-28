import { StatusBar, SafeAreaView, Text, View } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import TabNavigation from "./TabNavigation";
import LoginScreen from "./screens/LoginScreen";

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    return (
        <View style={{
            flex: 1
        }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen}/>
                    <Stack.Screen name="Main" component={TabNavigation}/>
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

export default StackNavigation;