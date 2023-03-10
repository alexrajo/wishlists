import {
  Center,
  Heading,
  View,
  Text,
  FlatList,
  Box,
  CircleIcon,
  HStack,
  Button,
  Pressable,
  AlertDialog,
  Spinner,
} from "native-base";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { HOST } from "../../config/variables";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import { Item, Wishlist } from "../../config/types";
import SimpleAlertDialog from "../../components/SimpleAlertDialog";

const ListViewingPage = ({
  route,
  navigation,
}: {
  route: { params: { wishlist: Wishlist } };
  navigation: any;
}) => {
  const { wishlist } = route.params;
  const items = wishlist.items;
  const isOwnWishlist = true;

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState<RequestInfo>();
  const {
    data: deleteResponseData,
    isPending: isDeleting,
    error: deletionError,
    statusCode: deletionStatusCode,
  } = useFetch(deleteRequest);

  const { authToken, loggedIn, userData } = useAuth();
  const cancelRef = useRef(null);
  const canShowSettings =
    loggedIn && userData !== undefined && userData.userId === wishlist.ownerId;

  const onDeleteConfirmed = () => {
    if (!isOwnWishlist) return;

    setDeleteRequest(
      new Request(`${HOST}/api/deletewishlist`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `JWT ${authToken}`,
        },
        body: JSON.stringify({
          wishlistId: wishlist.wishlistId,
        }),
      })
    );

    setIsDeleteAlertOpen(false);
  };

  useEffect(() => {
    if (!isDeleting && deletionStatusCode === 200) {
      navigation.goBack();
    }
  }, [isDeleting]);

  return (
    <View flex={1}>
      <Center flex={1} paddingTop={5}>
        <Heading>{wishlist.title}</Heading>
        <Text>{wishlist.description}</Text>
        {deletionError && (
          <Text>
            Error ({deletionStatusCode}): {deletionError}
          </Text>
        )}
        <FlatList
          marginTop={5}
          style={styles.list}
          data={items}
          renderItem={(itemData: ListRenderItemInfo<Item>) => (
            <WishlistItemComponent
              itemInfo={itemData.item}
              isOwn={isOwnWishlist}
            />
          )}
          keyExtractor={(item) => item.itemId.toString()}
        />
      </Center>
      {canShowSettings && (
        <>
          <Pressable
            position="absolute"
            right={5}
            top={5}
            onPress={() => setIsDeleteAlertOpen(true)}
          >
            <MaterialIcons name="delete-forever" color="red" size={32} />
          </Pressable>

          <SimpleAlertDialog
            title="Delete wishlist"
            isAlertDialogOpen={isDeleteAlertOpen}
            setIsAlertDialogOpen={setIsDeleteAlertOpen}
            onConfirm={onDeleteConfirmed}
            confirmText="Delete"
            confirmColor="rose"
          >
            <Text>
              Are you sure you want to PERMANENTLY delete this wishlist?
            </Text>
          </SimpleAlertDialog>
        </>
      )}
    </View>
  );
};

const WishlistItemComponent = ({
  itemInfo,
  isOwn,
}: {
  itemInfo: Item;
  isOwn: boolean;
}) => {
  const displayAsClaimed = !isOwn && itemInfo.claimedById !== undefined;

  return (
    <Box
      m={2}
      paddingBottom={2}
      flex={1}
      borderBottomColor="gray.300"
      borderBottomWidth="1"
    >
      <HStack alignItems="center" space={2}>
        <CircleIcon color="black" size="xs" flex={1} />
        <View flexDirection="row" flex={5}>
          <Text
            fontSize="lg"
            textDecorationLine={displayAsClaimed ? "line-through" : "none"}
            color={displayAsClaimed ? "gray.400" : "black"}
          >
            {itemInfo.name}
          </Text>
          {displayAsClaimed && (
            <Text color="gray.400" fontSize="lg" fontStyle="italic">
              {" "}
              Claimed
            </Text>
          )}
        </View>
        {!displayAsClaimed && !isOwn && (
          <View flex={2}>
            <Button alignSelf="flex-end">Claim</Button>
          </View>
        )}
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "white",
    width: "80%",
  },
});

export default ListViewingPage;
