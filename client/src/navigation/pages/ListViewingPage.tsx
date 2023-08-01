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
  Modal,
  VStack,
  Input,
} from "native-base";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { HOST } from "../../config/variables";
import useFetch from "../../hooks/useFetch";
import { useUser } from "../../hooks/useUser";
import { Item, Wishlist } from "../../config/types";
import SimpleAlertDialog from "../../components/SimpleAlertDialog";
import { StackScreenProps } from "@react-navigation/stack";
import { FriendsStackParamList } from "./tabs/Friends/FriendsStackNavigator";

type ListViewingPageProps = StackScreenProps<FriendsStackParamList, "ViewList">;
type AddNewItemButtonProps = {
  onPress: () => void;
};

const ListViewingPage = (props: ListViewingPageProps) => {
  const { navigation, route } = props;
  const { wishlist } = route.params;
  const isOwnWishlist = true;

  const [items, setItems] = useState<Array<Item>>(wishlist.items);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState<RequestInfo>();
  const {
    data: deleteResponseData,
    isPending: isDeleting,
    error: deletionError,
    statusCode: deletionStatusCode,
  } = useFetch(deleteRequest);

  const { authToken, loggedIn, userData } = useUser();
  const cancelRef = useRef(null);
  const canShowSettings = loggedIn && userData !== undefined && userData.userId === wishlist.ownerId;

  const onItemCreationConfirmed = (itemText: string) => {
    for (const item of items) {
      if (item.name === itemText) return;
    }
    if (itemText.length < 1) return;
    setIsCreateItemModalOpen(false);
    const itemsTemp = [...items];

    const tempItem: Item = { itemId: items.length, name: itemText };
    itemsTemp.push(tempItem);
    setItems(itemsTemp);

    // TODO: Request item creation to api
  };

  const onItemDeletionConfirmed = (item: Item) => {
    const itemsTemp = [...items];
    const index = itemsTemp.indexOf(item);
    itemsTemp.splice(index, 1);
    setItems(itemsTemp);
  };

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
          style={styles.list}
          data={[...items, { itemId: -1, name: "Add new item" }]}
          renderItem={(itemData: ListRenderItemInfo<Item>) => {
            if (itemData.item.itemId === -1)
              return (
                <AddNewItemButton
                  onPress={() => {
                    setIsCreateItemModalOpen(true);
                  }}
                />
              );
            return <WishlistItemComponent itemInfo={itemData.item} isOwn={isOwnWishlist} />;
          }}
          keyExtractor={(item) => item.itemId.toString()}
        />
      </Center>
      {canShowSettings && (
        <>
          <Pressable position="absolute" right={5} top={5} onPress={() => setIsDeleteAlertOpen(true)}>
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
            <Text>Are you sure you want to PERMANENTLY delete this wishlist?</Text>
          </SimpleAlertDialog>
        </>
      )}
      <CreateItemModal
        showModal={isCreateItemModalOpen}
        setShowModal={setIsCreateItemModalOpen}
        onConfirm={onItemCreationConfirmed}
      />
    </View>
  );
};

const AddNewItemButton = (props: AddNewItemButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const onPress = props.onPress;

  return (
    <Pressable
      m={2}
      paddingBottom={2}
      flex={1}
      alignItems={"center"}
      borderBottomColor="gray.300"
      borderBottomWidth="1"
      onPressIn={setIsPressed.bind(this, true)}
      onPressOut={setIsPressed.bind(this, false)}
      onPress={onPress}
    >
      <Text fontSize={"2xl"} fontWeight={"bold"} color={isPressed ? "gray.200" : "gray.400"}>
        +
      </Text>
    </Pressable>
  );
};

const WishlistItemComponent = ({ itemInfo, isOwn }: { itemInfo: Item; isOwn: boolean }) => {
  const displayAsClaimed = !isOwn && itemInfo.claimedById !== undefined;

  return (
    <Box m={2} paddingBottom={2} flex={1} borderBottomColor="gray.300" borderBottomWidth="1">
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

const CreateItemModal = ({
  showModal,
  setShowModal,
  onConfirm,
}: {
  showModal: boolean;
  setShowModal: (arg0: boolean) => void;
  onConfirm?: (arg0: string) => void;
}) => {
  const [text, setText] = useState("");

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="80%">
        <Modal.CloseButton />
        <Modal.Header>Add item to wishlist</Modal.Header>
        <Modal.Body>
          <VStack>
            <Text>Text</Text>
            <Input
              isRequired
              type="text"
              placeholder="Item name and description"
              value={text}
              onChangeText={setText}
              clearButtonMode="always"
            />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" onPress={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                if (!onConfirm) return;
                onConfirm(text);
              }}
            >
              Add
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: "white",
    width: "80%",
    marginTop: 5,
  },
});

export default ListViewingPage;
