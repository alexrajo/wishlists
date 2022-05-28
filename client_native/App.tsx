import React from 'react';
import { NativeBaseProvider, extendTheme, Stack } from 'native-base';
import StackNavigation from "./navigation/StackNavigation";
import { LinearGradient } from 'react-native-svg';
import { StatusBar } from 'react-native';

export default function App() {
  const theme = extendTheme({
    colors: {
      primary: {
        50: "#0d3561",
        200: "#155c96",
        400: "#1e9be3",
        600: "#2fb3f5",
        800: "#70cfff"
      }
    }
  });

  const config = {
    dependencies: {
      "linear-gradient": LinearGradient
    }
  };

  return (
    <NativeBaseProvider theme={theme} config={config}>
      <StatusBar barStyle="dark-content" />
      <StackNavigation/>
    </NativeBaseProvider>
  );
}
