import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import FeedTab from "./tabs/FeedTab";
import FriendsTab from "./tabs/FriendsTab";
import MyListsTab from "./tabs/MyListsTab";
import ProfileStackNavigator from "./tabs/Profile/ProfileStackNavigator";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Feed" screenOptions={({route}) => ({
        headerShown: true,
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === "Feed") return <FontAwesome name="feed" color={color} size={size}/>;
          if (route.name === "My lists") return <FontAwesome name="list-ul" color={color} size={size}/>;
          if (route.name === "Friends") return <FontAwesome5 name="user-friends" color={color} size={size}/>;
          if (route.name === "Profile") return <MaterialCommunityIcons name="account" color={color} size={size}/>;
          return <FontAwesome name="question" color={color} size={size}/>
        }
      })}>
      <Tab.Screen name="Feed" component={FeedTab}/>
      <Tab.Screen name="My lists" component={MyListsTab}/>
      <Tab.Screen name="Friends" component={FriendsTab}/>
      <Tab.Screen name="Profile" component={ProfileStackNavigator}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
