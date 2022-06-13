import {
  Center,
  Text,
  View,
  Box,
  Heading,
  FormControl,
  VStack,
  Input,
  Button,
} from "native-base";
import { useContext, useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import useAuth from "../../hooks/useAuth";

const LandingScreen = (props: any) => {

  const {loggedIn} = useAuth();

  const onGoToRegisterScreenPressed = () => {
    props.navigation.navigate("Register");
  };

  const onGoToLoginScreenPressed = () => {
    props.navigation.navigate("Login");
  };

  useEffect(() => {
    if (loggedIn) props.navigation.navigate("Tabs");
  }, [loggedIn]);

  return (
    <View style={styles.container}>
      <Center style={styles.container} p="10">
        <Box alignItems={"center"}>
          <Heading>Welcome!</Heading>
          <Heading>Let's get started.</Heading>
          <Button onPress={onGoToRegisterScreenPressed} mt="6">
            SIGN UP
          </Button>
          <Text fontSize={"md"} mt="3">
            Already have an account?
          </Text>
          <Button onPress={onGoToLoginScreenPressed} m="3">
            LOG IN
          </Button>
        </Box>
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LandingScreen;
