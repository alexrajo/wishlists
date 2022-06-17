import {
  Avatar,
  View,
  Center,
  Box,
  Heading,
  Text,
  VStack,
  Button,
} from "native-base";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import useAuth from "../../../../hooks/useAuth";
import { useEffect, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import { HOST } from "../../../../config/variables";

const ProfileTab = ({navigation}: any) => {
  const { loggedIn, authToken } = useAuth();

  const createNewRequest = () => (
    new Request(`${HOST}/api/myprofile`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `JWT ${authToken}`,
      },
    })
  );
  const [request, setRequest] = useState(createNewRequest());
  const { data: profileData, error: fetchError, isPending, refresh } = useFetch(request);

  const onSettingsButtonPressed = () => {
    navigation.navigate("Settings");
  };

  useEffect(() => {
    setRequest(createNewRequest());
  }, [authToken]);

  return (
    <View flex={1}>
      <Center flex={1}>
        {fetchError && <><Text color={"red.500"}>{fetchError}</Text><Button onPress={refresh}>Try again</Button></>}
        {profileData && (
          <Box rounded="md" style={styles.userInfoContainer}>
            <Pressable
              style={styles.openSettingsButton}
              onPress={onSettingsButtonPressed}
            >
              <FontAwesome5 name="cog" size={20} color="gray" />
            </Pressable>
            <VStack space={5} style={styles.userInfoInnerContainer}>
              <Avatar bg="blue.300" size="xl" style={styles.profilePicture}>
                {DefaultAvatarIcon()}
              </Avatar>
              <Box alignItems={"center"}>
                <Heading textAlign="center">
                  {profileData.firstName + " " + profileData.lastName}
                </Heading>
                <Text fontStyle={"italic"}>@{profileData.username}</Text>
              </Box>
              <Text>{profileData.email}</Text>
              <Box>
                <Text alignSelf="flex-start" fontWeight="semibold">
                  About me:
                </Text>
                <Text marginX={3} fontStyle="italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  finibus tempor urna pretium convallis. Sed ut ipsum ornare
                  lorem eleifend sollicitudin.
                </Text>
              </Box>
            </VStack>
          </Box>
        )}
      </Center>
    </View>
  );
};

const DefaultAvatarIcon = () => (
  <MaterialCommunityIcons name="account" size={80} color="white" />
);

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: "white",
    alignSelf: "stretch",
    margin: 30,
  },

  userInfoInnerContainer: {
    paddingHorizontal: 25,
    alignItems: "center",
    transform: [{ translateY: -50 }],
    zIndex: 0,
  },

  profilePicture: {
    borderColor: "white",
    borderWidth: 5,
    shadowColor: "black",
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
  },

  openSettingsButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
});

export default ProfileTab;
