import { StackScreenProps } from "@react-navigation/stack";
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
  TextArea,
  View,
  VStack,
} from "native-base";
import { useEffect, useState, useRef } from "react";
import KeyboardAvoidingWrapper from "../../../../components/KeyboardAvoidingWrapper";
import SimpleAlertDialog from "../../../../components/SimpleAlertDialog";
import { ProfileStackParams } from "../../../../config/types";
import { HOST } from "../../../../config/variables";
import useAuth from "../../../../hooks/useAuth";
import useFetch from "../../../../hooks/useFetch";
import useTopStackNavigator from "../../../../hooks/useTopStackNavigator";

type ProfileSettingsPageProps = StackScreenProps<ProfileStackParams, "Settings">;

type AlertProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onConfirm: () => void;
};

// EMAIL_REGEXP found at:
// https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
const EMAIL_REGEXP =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const LogoutAlert = (props: AlertProps) => {
  const { isOpen, setIsOpen, onConfirm } = props;
  return (
    <SimpleAlertDialog
      title="Log out of account"
      confirmText="Log out"
      cancelText="Cancel"
      isAlertDialogOpen={isOpen}
      setIsAlertDialogOpen={setIsOpen}
      onConfirm={onConfirm}
      confirmColor="rose"
    >
      <Text>Are you sure you want to log out? You will need to re-enter your login information to log back in.</Text>
    </SimpleAlertDialog>
  );
};

const PasswordChangeAlert = (props: AlertProps) => {
  const { isOpen, setIsOpen, onConfirm } = props;
  const { authToken, refreshAuthToken } = useAuth();

  const [isValid, setIsValid] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [repeatedPassword, setRepeatedPassword] = useState<string>();

  const onChangePasswordConfirmed = () => {
    setOldPassword(undefined);
    setNewPassword(undefined);
    setRepeatedPassword(undefined);

    // Send request to api
    fetch(`${HOST}/api/changepassword`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `JWT ${authToken}`,
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    })
      .then((res: Response) => {
        if (res.status === 401) refreshAuthToken();
        if (!res.ok) throw new Error("Error when changing password, status: " + res.status.toString());
        setIsOpen(false);
        onConfirm();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const checkInputValidity = () => {
    if (oldPassword === undefined || newPassword === undefined) {
      setIsValid(false);
      return;
    }
    const oldPasswordValid = oldPassword.length > 0;
    const newPasswordsMatch = newPassword === repeatedPassword;
    setIsValid(oldPasswordValid && newPasswordsMatch);
  };

  useEffect(checkInputValidity, [oldPassword, newPassword, repeatedPassword]);

  return (
    <SimpleAlertDialog
      title="Change password"
      confirmText="Change"
      cancelText="Cancel"
      isAlertDialogOpen={isOpen}
      setIsAlertDialogOpen={setIsOpen}
      onConfirm={onChangePasswordConfirmed}
      isConfirmationRestricted={!isValid}
      confirmColor="success"
    >
      <FormControl>
        <FormControl.Label>Old password</FormControl.Label>
        <Input
          type="password"
          placeholder="Type old password..."
          onChangeText={(text) => setOldPassword(text)}
          value={oldPassword}
        />
        <FormControl.Label>New password</FormControl.Label>
        <Input
          type="password"
          placeholder="Type new password..."
          onChangeText={(text) => setNewPassword(text)}
          value={newPassword}
        />
        <FormControl.Label>Repeat new password</FormControl.Label>
        <Input
          type="password"
          placeholder="Repeat new password..."
          onChangeText={(text) => setRepeatedPassword(text)}
          value={repeatedPassword}
        />
      </FormControl>
    </SimpleAlertDialog>
  );
};

const ProfileSettingsPage = ({ navigation, route }: ProfileSettingsPageProps) => {
  const { loggedIn, isPending, logout, authToken, refreshAuthToken } = useAuth();
  const { firstName: initialFirstName, lastName: initialLastName, email } = route.params || {};
  const [isEmailValid, setIsEmailValid] = useState(true);

  const firstNameInput = useRef(initialFirstName);
  const lastNameInput = useRef(initialLastName);
  const emailInput = useRef(email);

  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isChangePasswordAlertOpen, setIsChangePasswordAlertOpen] = useState(false);

  const topStackNavigation = useTopStackNavigator();

  const onChangeNameClicked = () => {
    if (firstNameInput.current === initialFirstName && lastNameInput.current === initialLastName) return;
    // Send request to api
    fetch(`${HOST}/api/changename`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `JWT ${authToken}`,
      },
      body: JSON.stringify({
        firstName: firstNameInput.current,
        lastName: lastNameInput.current,
      }),
    })
      .then((res: Response) => {
        if (res.status === 401) refreshAuthToken();
        if (!res.ok) throw new Error("Error when changing name, status: " + res.status.toString());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onLogoutConfirmed = () => {
    setIsLogoutAlertOpen(false);
    logout();
  };

  useEffect(() => {
    if (loggedIn) return;
    navigation.navigate("Info");
    topStackNavigation.navigate("Login");
  }, [loggedIn]);

  const checkEmailValidity = (email: string) => {
    const valid = email !== undefined ? email.match(EMAIL_REGEXP) !== null : false;
    setIsEmailValid(valid);
  };

  return (
    <KeyboardAvoidingWrapper>
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
                  defaultValue={initialFirstName}
                  onChangeText={(text) => {
                    firstNameInput.current = text;
                  }}
                ></Input>
                <Button onPress={onChangeNameClicked}>OK</Button>
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
                  defaultValue={initialLastName}
                  onChangeText={(text) => {
                    lastNameInput.current = text;
                  }}
                ></Input>
                <Button onPress={onChangeNameClicked}>OK</Button>
              </HStack>
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" isReadOnly={true} isDisabled>
                12345678
              </Input>
              <Button m={5} onPress={() => setIsChangePasswordAlertOpen(true)}>
                Change password
              </Button>
            </FormControl>
            <FormControl isInvalid={!isEmailValid}>
              <FormControl.Label>Email</FormControl.Label>
              <HStack space={5}>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  flex={1}
                  onChangeText={checkEmailValidity}
                  ref={emailInput}
                  defaultValue={email}
                ></Input>
                <Button>OK</Button>
              </HStack>
              <FormControl.ErrorMessage>Email is invalid</FormControl.ErrorMessage>
              <FormControl.HelperText>
                Having an email attached to your account makes it easier to recover access to your account, should you
                forget your password.
              </FormControl.HelperText>
            </FormControl>
            <Spacer />
            <Button isLoading={isPending} colorScheme="rose" onPress={() => setIsLogoutAlertOpen(true)}>
              LOG OUT
            </Button>
            <Spacer />
            <LogoutAlert onConfirm={onLogoutConfirmed} isOpen={isLogoutAlertOpen} setIsOpen={setIsLogoutAlertOpen} />
            <PasswordChangeAlert
              onConfirm={() => {}}
              isOpen={isChangePasswordAlertOpen}
              setIsOpen={setIsChangePasswordAlertOpen}
            />
          </VStack>
        </ScrollView>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default ProfileSettingsPage;
