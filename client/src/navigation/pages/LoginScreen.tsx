import { Center, Text, View, Box, Heading, FormControl, VStack, HStack, Input, Button, Alert } from "native-base";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { useUser } from "../../hooks/useUser";
import ErrorAlert from "../../components/ErrorAlert";
import { HOST } from "../../config/variables";

const LoginScreen = (props: any) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [canProceed, setCanProceed] = useState(false);

  const { loggedIn, isPending: authIsPending, error: authError, login } = useUser();

  const onGoToRegisterScreenPressed = () => {
    props.navigation.navigate("Register");
  };

  const onLoginPressed = () => {
    login(usernameOrEmail, password);
  };

  useEffect(() => {
    if (loggedIn) {
      props.navigation.navigate("Tabs");
    }
  }, [loggedIn]);

  useEffect(() => {
    setCanProceed(usernameOrEmail && password ? true : false);
  }, [usernameOrEmail, password]);

  return (
    <View style={styles.container}>
      <Center style={styles.container} p={15}>
        {!authIsPending && authError && !loggedIn && <ErrorAlert error={authError} />}
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
          <Button
            isDisabled={!canProceed}
            isLoading={authIsPending}
            isLoadingText="LOGGING IN"
            onPress={onLoginPressed}
          >
            LOG IN
          </Button>
          <Box>
            <Text fontSize={"lg"}>Don't have an account?</Text>
            <Button onPress={onGoToRegisterScreenPressed}>CREATE AN ACCOUNT</Button>
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
