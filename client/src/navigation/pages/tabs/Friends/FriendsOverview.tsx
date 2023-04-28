import {
  View,
  Box,
  HStack,
  Text,
  Divider,
  Fab,
  Icon,
  CloseIcon,
  Center,
  Button,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useAuth from "../../../../hooks/useAuth";
import RefreshableList from "../../../../components/RefreshableList";
import {
  Friendship,
  LimitedUserInfo,
  ListItemRenderer,
} from "../../../../config/types";
import { ListBox, ListButton } from "../../../../components/ListElements";
import useFetch from "../../../../hooks/useFetch";
import { HOST } from "../../../../config/variables";
import SimpleAlertDialog from "../../../../components/SimpleAlertDialog";
import ErrorAlert from "../../../../components/ErrorAlert";

interface DeleteFriendshipComponentWrapperProps {
  targetUser: LimitedUserInfo;
  friendshipId: number;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActionRequest?: React.Dispatch<
    React.SetStateAction<RequestInfo | undefined>
  >;
  setAlertDialogInformation?: React.Dispatch<
    React.SetStateAction<{
      alertTitle: string;
      alertBody: string;
      onConfirm: () => void;
    }>
  >;
  alertTitle?: string;
  alertBody?: string;
}

interface DeleteFriendshipComponentProps
  extends DeleteFriendshipComponentWrapperProps {
  alertTitle: string;
  alertBody: string;
}

const DeleteFriendshipComponent: React.FC<DeleteFriendshipComponentProps> = ({
  targetUser,
  friendshipId,
  setActionRequest,
  setAlertDialogInformation,
  setIsAlertDialogOpen,
  alertTitle,
  alertBody,
}) => {
  const { authToken } = useAuth();

  const onCancelRequestConfirmed = () => {
    if (setActionRequest === undefined) return;
    setActionRequest(
      new Request(`${HOST}/api/deletefriendship`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `JWT ${authToken}`,
        },
        body: JSON.stringify({
          friendshipId: friendshipId,
        }),
      })
    );
  };

  const onPress = () => {
    if (setAlertDialogInformation !== undefined) {
      setAlertDialogInformation({
        alertTitle: alertTitle,
        alertBody: alertBody,
        onConfirm: onCancelRequestConfirmed,
      });
    }
    setIsAlertDialogOpen(true);
  };

  return (
    <Button colorScheme="red" variant="outline" onPress={onPress}>
      <CloseIcon />
    </Button>
  );
};

const CancelRequestComponent: React.FC<
  DeleteFriendshipComponentWrapperProps
> = (props) => {
  return (
    <DeleteFriendshipComponent
      {...props}
      alertTitle="Cancel friend request"
      alertBody={`Are you sure you want to cancel the friend request to @${props.targetUser.username}?`}
    />
  );
};

const DenyRequestComponent: React.FC<DeleteFriendshipComponentWrapperProps> = (
  props
) => {
  return (
    <DeleteFriendshipComponent
      {...props}
      alertTitle="Deny friend request"
      alertBody={`Are you sure you want to deny the friend request from @${props.targetUser.username}?`}
    />
  );
};

const FriendsOverview = ({ navigation }: any) => {
  const { userData, authToken } = useAuth();
  const [selectedSection, setSelectedSection] = useState(0);
  const [listRefreshSignal, setListRefreshSignal] = useState<number>();
  const [actionRequest, setActionRequest] = useState<RequestInfo>();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [{ alertTitle, alertBody, onConfirm }, setAlertDialogInformation] =
    useState({
      alertTitle: "Are you sure?",
      alertBody: "Are you sure you want to perform this action?",
      onConfirm: () => {},
    });

  const {
    data: actionResponseData,
    isPending,
    error,
    statusCode,
  } = useFetch(actionRequest);

  useEffect(() => {
    if (isPending) return;
    if (listRefreshSignal === undefined) {
      setListRefreshSignal(0);
      return;
    }
    setListRefreshSignal((listRefreshSignal % 31) + 1);
  }, [isPending]);

  const onAddFriendPressed = () => {
    navigation.navigate("AddFriend");
  };

  const onAcceptFriendRequestPressed = (friendshipId: number) => {
    setActionRequest(
      new Request(`${HOST}/api/acceptfriendship`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `JWT ${authToken}`,
        },
        body: JSON.stringify({
          friendshipId: friendshipId,
        }),
      })
    );
  };

  const onViewProfilePressed = (
    user: LimitedUserInfo,
    friendshipId: number
  ) => {
    navigation.navigate("ViewFriend", {
      friendshipId: friendshipId,
      profileData: user,
    });
  };

  const friendshipListItemRenderer: ListItemRenderer<Friendship> = ({
    item: friendship,
  }) => {
    if (userData === undefined) return null;
    const {
      friendshipId,
      confirmed,
      initiator,
      receiver,
      initiatorId,
      receiverId,
    } = friendship;

    /*
     * 0 = default = 'Friends'
     * 1 = 'Requests' (incoming)
     * 2 = 'Outgoing'
     */
    switch (selectedSection) {
      case 1:
        return !confirmed &&
          initiator !== undefined &&
          receiverId === userData.userId ? (
          <ListBox
            menucomponents={
              <HStack alignItems="center" space={2}>
                <Button
                  colorScheme="emerald"
                  p={2}
                  onPress={() => onAcceptFriendRequestPressed(friendshipId)}
                >
                  Accept
                </Button>
                <DenyRequestComponent
                  targetUser={initiator}
                  friendshipId={friendshipId}
                  setActionRequest={setActionRequest}
                  setAlertDialogInformation={setAlertDialogInformation}
                  setIsAlertDialogOpen={setIsAlertDialogOpen}
                />
              </HStack>
            }
          >
            <Text>@{initiator.username}</Text>
          </ListBox>
        ) : null;
      case 2:
        return !confirmed &&
          receiver !== undefined &&
          initiatorId === userData.userId ? (
          <ListBox
            menucomponents={
              <CancelRequestComponent
                targetUser={receiver}
                friendshipId={friendshipId}
                setActionRequest={setActionRequest}
                setAlertDialogInformation={setAlertDialogInformation}
                setIsAlertDialogOpen={setIsAlertDialogOpen}
              />
            }
          >
            <Text>@{receiver.username}</Text>
          </ListBox>
        ) : null;
      default:
        return confirmed &&
          initiator !== undefined &&
          receiver !== undefined ? (
          <ListButton
            onPress={() => {
              onViewProfilePressed(
                initiatorId === userData.userId ? receiver : initiator,
                friendshipId
              );
            }}
          >
            <Text>
              @
              {initiatorId === userData.userId
                ? receiver.username
                : initiator.username}
            </Text>
          </ListButton>
        ) : null;
    }
  };

  return (
    <View flex={1}>
      <Box
        height={10}
        bg="gray.100"
        borderBottomColor="gray.300"
        borderBottomWidth={1}
      >
        <HStack flex={1} justifyContent="space-evenly" alignItems="center">
          <Box flex={1} alignItems="center">
            <Pressable onPress={() => setSelectedSection(0)}>
              <Text fontWeight={selectedSection === 0 ? "semibold" : "normal"}>
                Friends
              </Text>
            </Pressable>
          </Box>
          <Divider orientation="vertical" bg="gray.300" />
          <Box flex={1} alignItems="center">
            <Pressable onPress={() => setSelectedSection(1)}>
              <Text fontWeight={selectedSection === 1 ? "semibold" : "normal"}>
                Requests
              </Text>
            </Pressable>
          </Box>
          <Divider orientation="vertical" bg="gray.300" />
          <Box flex={1} alignItems="center">
            <Pressable onPress={() => setSelectedSection(2)}>
              <Text fontWeight={selectedSection === 2 ? "semibold" : "normal"}>
                Outgoing
              </Text>
            </Pressable>
          </Box>
        </HStack>
      </Box>
      <RefreshableList
        endpoint="/api/friendships"
        keyExtractor={(friendship: Friendship) =>
          friendship.friendshipId.toString()
        }
        itemRenderer={friendshipListItemRenderer}
        refreshSignal={listRefreshSignal}
        placeholder="Looks like nothing was found."
      />
      <Fab
        onPress={onAddFriendPressed}
        bg="white"
        renderInPortal={false}
        shadow={2}
        size="md"
        icon={<Icon color="black" as={AntDesign} name="adduser" size="md" />}
      />
      <SimpleAlertDialog
        title={alertTitle}
        cancelText="No"
        confirmText="Yes"
        onConfirm={onConfirm}
        isAlertDialogOpen={isAlertDialogOpen}
        setIsAlertDialogOpen={setIsAlertDialogOpen}
      >
        <p>{alertBody}</p>
      </SimpleAlertDialog>
      <Center flex={1}>
        {!isPending && error && (
          <ErrorAlert error={`${error} (${statusCode})`} />
        )}
      </Center>
    </View>
  );
};

export default FriendsOverview;
