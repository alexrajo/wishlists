import {
  createBottomTabNavigator,
  BottomTabBarHeightContext,
} from "@react-navigation/bottom-tabs";
import FeedScreen from "./screens/FeedScreen";
import CreateScreen from "./screens/CreateScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "react-native";

type ItemIconConfigurationType = {
  normal: String;
  focus: String;
};

type IconConfigurationType = {
  [key: string]: ItemIconConfigurationType;
};

const IconConfiguration: IconConfigurationType = {
  Home: { normal: "home-outline", focus: "home" },
  Create: { normal: "create-outline", focus: "create" },
  Profile: { normal: "person-outline", focus: "person" },
  Fallback: { normal: "help-circle-outline", focus: "help-circle" },
};

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <div>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconInformation: ItemIconConfigurationType =
              IconConfiguration[route.name] || IconConfiguration.Fallback;
            const iconName: any = focused
              ? iconInformation.focus
              : iconInformation.normal;
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#444",
          tabBarInactiveTintColor: "#AAA",
        })}
      >
        <Tab.Screen name="Home" component={FeedScreen} />
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </div>
  );
};

export default TabNavigation;
