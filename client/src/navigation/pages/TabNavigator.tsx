import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "native-base";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Text>Tabs!</Text>
        </Tab.Navigator>
    );
};

export default TabNavigator;