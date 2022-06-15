import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  ScrollView,
  Spacer,
  Text,
  View,
  VStack,
} from "native-base";
import { useEffect } from "react";
import useAuth from "../../../../hooks/useAuth";

const ProfileSettingsPage = () => {
  const { loggedIn, logout } = useAuth();
  const onLogoutPressed = () => logout;

  useEffect(() => {
    //Refer to the stack navigator at the top of the nest of navigators to navigate to the login page (useContext)
  }, [loggedIn]);

  return (
    <View flex={1} paddingTop={5} paddingX={5}>
      <Heading marginBottom={5}>Settings</Heading>
      <ScrollView>
        <VStack paddingX={5} space={5}>
          <FormControl>
            <FormControl.Label>First name</FormControl.Label>
            <HStack space={5}>
              <Input
                type="text"
                isRequired={true}
                placeholder="Enter your first name"
                flex={1}
              ></Input>
              <Button>OK</Button>
            </HStack>
          </FormControl>
          <FormControl>
            <FormControl.Label>Last name</FormControl.Label>
            <HStack space={5}>
              <Input
                type="text"
                isRequired={true}
                placeholder="Enter your last name"
                flex={1}
              ></Input>
              <Button>OK</Button>
            </HStack>
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" isReadOnly={true}>
              12345678
            </Input>
            <Button m={5}>Change password</Button>
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <HStack space={5}>
              <Input
                type="text"
                placeholder="Enter your email"
                flex={1}
              ></Input>
              <Button>OK</Button>
            </HStack>
            <FormControl.HelperText>
              Having an email attached to your account makes it easier to
              recover access to your account, should you forget your password.
            </FormControl.HelperText>
          </FormControl>
          <Spacer />
          <Button bg={"red.500"} onPress={onLogoutPressed}>
            LOG OUT
          </Button>
          <Spacer />
        </VStack>
      </ScrollView>
    </View>
  );
};

export default ProfileSettingsPage;
