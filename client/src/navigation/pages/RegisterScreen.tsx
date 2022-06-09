import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Text,
  View,
  VStack,
} from "native-base";
import { PropsWithRef, useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";

const RegisterScreen = (props: any) => {
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [canProceed, setCanProceed] = useState(false);

  const onGoToLoginScreenPressed = () => {
    props.navigation.navigate("Login");
  };

  useEffect(() => {
    setCanProceed(firstName && lastName && username && password ? true : false);
  }, [firstName, lastName, username, password]);

  return (
    <View style={styles.container}>
      <Center style={styles.container} p={15}>
        <Box alignItems={"center"}>
          <Heading>CREATE AN ACCOUNT</Heading>
          <FormControl>
            <VStack>
              <FormControl.Label>FIRST NAME</FormControl.Label>
              <Input
                type="text"
                placeholder="First name"
                variant={"filled"}
                value={firstName}
                onChangeText={setFirstName}
              />

              <FormControl.Label>LAST NAME</FormControl.Label>
              <Input
                type="text"
                placeholder="Last name"
                variant={"filled"}
                value={lastName}
                onChangeText={setLastName}
              />

              <FormControl.Label>EMAIL (optional)</FormControl.Label>
              <Input
                type="text"
                placeholder="Email"
                variant={"filled"}
                value={email}
                onChangeText={setEmail}
              />

              <FormControl.Label>USERNAME</FormControl.Label>
              <Input
                type="text"
                placeholder="Username"
                variant={"filled"}
                value={username}
                onChangeText={setUsername}
              />
              <FormControl.HelperText>
                Cannot contain special characters (eg. '!', '~')
              </FormControl.HelperText>

              <FormControl.Label>PASSWORD</FormControl.Label>
              <Input
                type="password"
                placeholder="Password"
                variant={"filled"}
                value={password}
                onChangeText={setPassword}
              />
              <FormControl.HelperText>
                Must be atleast 8 characters long
              </FormControl.HelperText>
            </VStack>
          </FormControl>
          <Button isDisabled={!canProceed}>CREATE ACCOUNT</Button>
          <Box>
            <Text fontSize={"lg"}>Already have an account?</Text>
            <Button onPress={onGoToLoginScreenPressed}>LOG IN</Button>
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

export default RegisterScreen;
