import React, { createContext, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";

const TopStackNavigatorContext = createContext({
    navigate: (uri: string) => {},
});

export const ProvideTopStackNavigator = ({children, navigation}: {children: React.ReactNode, navigation: StackNavigationProp<any, any>}) => {
    return <TopStackNavigatorContext.Provider value={navigation}>{children}</TopStackNavigatorContext.Provider>
}

const useTopStackNavigator = () => {
    return useContext(TopStackNavigatorContext);
}

export default useTopStackNavigator;