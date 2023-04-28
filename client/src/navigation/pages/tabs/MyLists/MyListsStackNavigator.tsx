import { createStackNavigator } from "@react-navigation/stack";
import ListViewingPage from "../../ListViewingPage";
import CreateNewListPage from "./CreateNewListPage";
import MyListsOverview from "./MyListsOverview";
import { Wishlist } from "../../../../config/types";

type MyListsStackParamList = {
  Overview: undefined;
  Create: undefined;
  ViewList: { wishlist: Wishlist };
};

const MyListsStack = createStackNavigator<MyListsStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <MyListsStack.Navigator
      initialRouteName="Overview"
      screenOptions={{ headerShown: false }}
    >
      <MyListsStack.Screen name="Overview" component={MyListsOverview} />
      <MyListsStack.Screen name="Create" component={CreateNewListPage} />
      <MyListsStack.Screen name="ViewList" component={ListViewingPage} />
    </MyListsStack.Navigator>
  );
};

export default ProfileStackNavigator;
