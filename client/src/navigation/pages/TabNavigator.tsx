import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedTab from "./tabs/FeedTab";
import FriendsTab from "./tabs/FriendsTab";
import MyListsTab from "./tabs/MyListsTab";
import ProfileTab from "./tabs/ProfileTab";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Feed" screenOptions={{headerShown: true}}>
      <Tab.Screen name="Feed" component={FeedTab}/>
      <Tab.Screen name="My lists" component={MyListsTab}/>
      <Tab.Screen name="Friends" component={FriendsTab}/>
      <Tab.Screen name="Profile" component={ProfileTab}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
