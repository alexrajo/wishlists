import {
  AlertDialog,
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
import { useEffect, useState, useRef } from "react";
import useAuth from "../../../../hooks/useAuth";
import useTopStackNavigator from "../../../../hooks/useTopStackNavigator";

const ProfileSettingsPage = ({navigation}: {navigation: any}) => {
  const { loggedIn, isPending, logout } = useAuth();

  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const cancelRef = useRef(null);

  const topStackNavigation = useTopStackNavigator();

  const onLogoutConfirmed = () => {
    setIsLogoutAlertOpen(false);
    logout();
  };

  useEffect(() => {
    if (loggedIn) return;
    navigation.navigate("Info");
    topStackNavigation.navigate("Login");
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
          <AlertDialog leastDestructiveRef={cancelRef} onClose={() => setIsLogoutAlertOpen(false)} isOpen={isLogoutAlertOpen}>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <Text fontWeight="semibold">Log out of account</Text>
                <AlertDialog.CloseButton/>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <Text>Are you sure you want to log out? You will need to re-enter your login information to log back in.</Text>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="ghost" onPress={() => setIsLogoutAlertOpen(false)} ref={cancelRef}>Cancel</Button>
                <Button onPress={onLogoutConfirmed} colorScheme="rose">Log out</Button>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
          <Button isLoading={isPending} colorScheme="rose" onPress={() => setIsLogoutAlertOpen(true)}>
            LOG OUT
          </Button>
          <Spacer />
        </VStack>
      </ScrollView>
    </View>
  );
};

export default ProfileSettingsPage;
