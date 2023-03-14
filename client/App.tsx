import { StatusBar } from "expo-status-bar";
import { extendTheme, NativeBaseProvider } from "native-base";
import StackNavigator from "./src/navigation/StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

export default () => {
  const theme = extendTheme({
    colors: {
      primary: {
        100: "#98d8fa",
        300: "#50b9f2",
        500: "#1499e0",
        700: "#0e83c2",
        900: "#044a80",
      },
    },
    components: {
      Button: {
        baseStyle: {
          rounded: "sm",
          color: "primary.300",
        },
        defaultProps: {
          size: "lg",
        },
      },
      Input: {
        defaultProps: {
          autoCapitalize: "none",
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <StatusBar />
        <Provider store={store}>
          <StackNavigator />
        </Provider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
