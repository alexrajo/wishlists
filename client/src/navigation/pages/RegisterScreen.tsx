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
import useAuth from "../../hooks/useAuth";
import ErrorAlert from "../../components/ErrorAlert";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const RegisterScreen = ({navigation}: any) => {
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(2000, 1, 1));
  const [canProceed, setCanProceed] = useState(false);
  const {loggedIn, isPending: authIsPending, error: authError, signup} = useAuth();

  const onGoToLoginScreenPressed = () => {
    navigation.navigate("Login");
  };

  const onRegisterPressed = () => {
    signup({
      firstName,
      lastName,
      username,
      password,
      email,
      dateOfBirth,
    });
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate;

    if (selectedDate !== undefined) {
      setDateOfBirth(currentDate!);
    }
  };

  useEffect(() => {
    setCanProceed(firstName && lastName && username && password ? true : false);
  }, [firstName, lastName, username, password]);

  useEffect(() => {
    if (!loggedIn) return;
    navigation.navigate("Tabs");
  }, [loggedIn]);

  return (
    <View style={styles.container}>
      <Center style={styles.container} p={15}>
        {!authIsPending && authError && !loggedIn && <ErrorAlert error={authError}/>}
        <Box alignItems={"center"}>
          <Heading>CREATE AN ACCOUNT</Heading>
          <FormControl>
            <FormControl.Label>First name</FormControl.Label>
            <Input
              type="text"
              placeholder="First name"
              variant={"filled"}
              value={firstName}
              onChangeText={setFirstName}
            />

            <FormControl.Label>Last name</FormControl.Label>
            <Input
              type="text"
              placeholder="Last name"
              variant={"filled"}
              value={lastName}
              onChangeText={setLastName}
            />

            <FormControl.Label>Email (optional)</FormControl.Label>
            <Input
              type="text"
              placeholder="Email"
              variant={"filled"}
              value={email}
              onChangeText={setEmail}
            />

            <FormControl.Label>Username</FormControl.Label>
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

            <FormControl.Label>Password</FormControl.Label>
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

            <FormControl.Label>Date of birth</FormControl.Label>
            {/* <Input
              type="text"
              placeholder="Date of birth"
              variant={"filled"}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            /> */}
            <View style={styles.dateTimePicker}>
              <RNDateTimePicker
                testID="dateTimePicker"
                value={dateOfBirth}
                mode="date"
                is24Hour={true}
                onChange={onDateChange}
              />
            </View>
            
          </FormControl>
          <Button marginTop={5} isDisabled={!canProceed} isLoading={authIsPending} onPress={onRegisterPressed}>CREATE ACCOUNT</Button>
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
  dateTimePicker: {
    width: 190
  }
});

export default RegisterScreen;
