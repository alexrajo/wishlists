import {
  Avatar,
  View,
  Center,
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
} from "native-base";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { LimitedUserInfo } from "../../../../config/types";
import SimpleAlertDialog from "../../../../components/SimpleAlertDialog";
import { useEffect, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import { HOST } from "../../../../config/variables";
import useAuth from "../../../../hooks/useAuth";

const FriendInfoDisplay = ({navigation, route}: {navigation: any, route: {params: {profileData: LimitedUserInfo, friendshipId: number}}}) => {
  const {profileData, friendshipId} = route.params;
  const {authToken} = useAuth();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const [removeFriendRequestInfo, setRemoveFriendRequestInfo] = useState<RequestInfo>();
  const {isPending: isRemovingFriend, error: friendRemovalError, statusCode: friendRemovalStatusCode} = useFetch(removeFriendRequestInfo);

  const onViewWishlistsPressed = () => {
    navigation.navigate("ViewWishlists", {
      userId: profileData.userId,
    });
  }

  const onRemoveFriendConfirmed = () => {
    console.log("Remove friend");
    setRemoveFriendRequestInfo(new Request(`${HOST}/api/deletefriendship`,
      {
        method: "POST",
        mode: "cors",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Authorization": `JWT ${authToken}`,
        },
        body: JSON.stringify({
            friendshipId: friendshipId,
        })
      }
    ));
  }

  useEffect(() => {
    if (!isRemovingFriend && friendRemovalStatusCode === 200) {
      navigation.navigate("Overview");
    }
  }, [isRemovingFriend, friendRemovalStatusCode]);

  return (
    <View flex={1}>
      <Center flex={1}>
        {isRemovingFriend || friendRemovalStatusCode === 200 ? <>
          <VStack>
            <Spinner/>
            <Text>Removing...</Text>
          </VStack>
        </> : <>
          {profileData && (
            <Box rounded="md" style={styles.userInfoContainer}>
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
                <Button onPress={onViewWishlistsPressed}>View wishlists</Button>
                <Button colorScheme="rose" onPress={() => setIsAlertDialogOpen(true)}>Remove friend</Button>
              </VStack>
            </Box>
          )}
        </>}
      </Center>
      <SimpleAlertDialog 
        title="Remove friend"
        bodyText={`Are you sure you want to remove ${profileData.firstName} ${profileData.lastName} as your friend?`}
        confirmText="Remove"
        cancelText="Cancel"
        isAlertDialogOpen={isAlertDialogOpen}
        setIsAlertDialogOpen={setIsAlertDialogOpen}
        onConfirm={onRemoveFriendConfirmed}
      />
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

export default FriendInfoDisplay;
