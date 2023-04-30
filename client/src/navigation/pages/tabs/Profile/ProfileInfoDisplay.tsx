import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  View,
} from "native-base";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { DisplayableUserInfo } from "../../../../config/types";
import useAuthorizedRequest from "../../../../hooks/useAuthorizedRequest";
import useFetch from "../../../../hooks/useFetch";
import { useUser } from "../../../../hooks/useUser";

const ProfileInfoDisplay = ({ navigation }: any) => {
  const { authToken } = useUser();

  const { getRequestObject: createNewRequest } = useAuthorizedRequest({
    endpoint: "/api/myprofile",
    method: "GET",
  });

  const [request, setRequest] = useState(createNewRequest());
  const {
    data: profileData,
    error: fetchError,
    isPending,
    refresh,
  } = useFetch<DisplayableUserInfo>(request);

  const onSettingsButtonPressed = () => {
    navigation.navigate("Settings", profileData);
  };

  useEffect(() => {
    setRequest(createNewRequest());
  }, [authToken]);

  return (
    <View flex={1}>
      <Flex flex={1}>
        {fetchError && (
          <>
            <Text color={"red.500"}>{fetchError}</Text>
            <Button onPress={refresh}>Try again</Button>
          </>
        )}
        {profileData && (
          <View style={styles.userInfoContainer}>
            <Box flex={1} bg={"white"} rounded={"md"} marginTop={50}>
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
                  <Text numberOfLines={4} marginX={3} fontStyle="italic">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi finibus tempor urna pretium convallis. Sed ut ipsum
                    ornare lorem eleifend sollicitudin.
                  </Text>
                </Box>
              </VStack>
            </Box>
          </View>
        )}
      </Flex>
    </View>
  );
};

const DefaultAvatarIcon = () => (
  <MaterialCommunityIcons name="account" size={80} color="white" />
);

const styles = StyleSheet.create({
  userInfoContainer: {
    position: "absolute",
    flex: 0,
    top: 30,
    bottom: 30,
    left: 30,
    right: 30,
  },

  userInfoInnerContainer: {
    paddingHorizontal: 25,
    alignItems: "center",
    zIndex: 0,
    position: "absolute",
    bottom: 5,
    top: -50,
    overflow: "hidden",
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

export default ProfileInfoDisplay;
