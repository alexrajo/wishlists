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
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import useAuth from "../../hooks/useAuth";

const LoginScreen = (props: any) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [canProceed, setCanProceed] = useState(false);

  const auth = useAuth();

  const onGoToRegisterScreenPressed = () => {
    props.navigation.navigate("Register");
  };

  const onLoginPressed = () => {
    auth.login(usernameOrEmail, password);
  }

  useEffect(() => {
    if (auth.loggedIn) {
      props.navigation.navigate("Tabs");
    }
  }, [auth.loggedIn]);

  useEffect(() => {
    setCanProceed(usernameOrEmail && password ? true : false);
  }, [usernameOrEmail, password]);

  return (
    <View style={styles.container}>
      <Center style={styles.container} p={15}>
        <Box alignItems={"center"}>
          <Heading>LOG IN</Heading>
          <FormControl>
            <VStack>
              <FormControl.Label>USERNAME OR EMAIL</FormControl.Label>
              <Input
                type="text"
                placeholder="Username or email"
                variant={"filled"}
                value={usernameOrEmail}
                onChangeText={setUsernameOrEmail}
              />

              <FormControl.Label>PASSWORD</FormControl.Label>
              <Input
                type="password"
                placeholder="Password"
                variant={"filled"}
                value={password}
                onChangeText={setPassword}
              />
            </VStack>
          </FormControl>
          <Button isDisabled={!canProceed} isLoading={auth.isPending}>LOG IN</Button>
          <Box>
            <Text fontSize={"lg"}>Don't have an account?</Text>
            <Button onPress={onGoToRegisterScreenPressed}>
              CREATE AN ACCOUNT
            </Button>
          </Box>
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

export default LoginScreen;
