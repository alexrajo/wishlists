import {
  View,
  Heading,
  Input,
  Button,
  SearchIcon,
  HStack,
  Text,
  Box,
  FlatList,
  Spinner,
  VStack,
  Center,
} from "native-base";
import { useEffect, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import { HOST } from "../../../../config/variables";
import { ListRenderItemInfo } from "react-native";
import { useUser } from "../../../../hooks/useUser";
import ErrorAlert from "../../../../components/ErrorAlert";
import { User } from "../../../../config/types";

const AddFriendPage = () => {
  const [username, setUsername] = useState<string>();
  const [request, setRequest] = useState<RequestInfo>();
  const { data: users, isPending, error } = useFetch<User[]>(request);

  const onSearchPressed = () => {
    setRequest(
      new Request(`${HOST}/api/searchusers`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      })
    );
  };

  return (
    <View flex={1} p={5}>
      <Heading marginBottom={5}>Add friend</Heading>
      <HStack alignItems="center">
        <Text flex={1}>@</Text>
        <Input
          flex={15}
          type="text"
          placeholder="Type a username"
          variant="outline"
          value={username}
          onChangeText={setUsername}
        />
      </HStack>
      <Button m={5} onPress={onSearchPressed} isLoading={isPending}>
        <HStack space={2} alignItems="center">
          <Text color="white">Search</Text>
          <SearchIcon color="white" />
        </HStack>
      </Button>
      {!isPending && error && <Text color="red.500">Error: {error}</Text>}
      {!isPending &&
        users !== undefined &&
        users !== null &&
        users.length < 1 && <Text>Could not find any users...</Text>}
      {isPending && (
        <VStack>
          <Spinner accessibilityLabel="Searching for users..." />
          <Text alignSelf="center">Searching for users...</Text>
        </VStack>
      )}
      <FlatList
        data={users}
        renderItem={(itemData: ListRenderItemInfo<User>) => (
          <ProfilePreview itemData={itemData} />
        )}
        keyExtractor={(item) => item.userId.toString()}
      />
    </View>
  );
};

const ProfilePreview = ({ itemData }: any) => {
  const userData = itemData.item;
  const [request, setRequest] = useState<RequestInfo>();
  const { data, isPending, error, statusCode } = useFetch(request);
  const { authToken } = useUser();

  const onSendFriendRequestPressed = () => {
    const userId = userData.userId;

    setRequest(
      new Request(`${HOST}/api/sendfriendrequest`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `JWT ${authToken}`,
        },
        body: JSON.stringify({
          targetUserId: userId,
        }),
      })
    );
  };

  return (
    <Box bg="white" rounded="md" p={2}>
      <Heading>{`${userData.firstName} ${userData.lastName}`}</Heading>
      <Text>@{userData.username}</Text>
      <Button
        m={2}
        onPress={onSendFriendRequestPressed}
        isLoading={isPending}
        isDisabled={statusCode === 201}
      >
        {statusCode === 201 ? "Request sent!" : "Send friend request"}
      </Button>
      <Center>
        {error && (
          <ErrorAlert
            error={
              statusCode === 409
                ? "Cannot send as there is already a relationship."
                : `${error}(${statusCode})`
            }
          />
        )}
      </Center>
    </Box>
  );
};

export default AddFriendPage;
