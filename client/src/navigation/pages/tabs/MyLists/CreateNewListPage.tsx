import {
  View,
  Center,
  Heading,
  FormControl,
  Input,
  TextArea,
  ScrollView,
  Radio,
  Flex,
  Box,
  Button,
  Modal,
  Text,
  VStack,
  Pressable,
} from "native-base";
import { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { HOST } from "../../../../config/variables";

const CreateNewListPage = ({ navigation }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const [items, setItems] = useState<Array<string>>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>();
  const { authToken, refreshAuthToken } = useAuth();

  const onCreateWishlistPressed = () => {
    if (!title) return;
    setIsPending(true);
    fetch(`${HOST}/api/createlist`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `JWT ${authToken}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        items: items.map((name: string) => {
          return { name: name };
        }),
      }),
    })
      .then((res: Response) => {
        if (res.status === 401) refreshAuthToken();
        if (!res.ok) throw new Error("Could not create wishlist");
        navigation.navigate("Overview");
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsPending(false));
  };

  const onModalConfirmed = (itemText: string) => {
    if (items.includes(itemText) || itemText.length < 1) return;
    setShowModal(false);
    const itemsTemp = [...items];
    itemsTemp.push(itemText);
    setItems(itemsTemp);
  };

  const onDeleteItemPressed = () => {
    if (selectedItemIndex === undefined) return;
    const itemsTemp = [...items];
    itemsTemp.splice(selectedItemIndex, 1);
    setSelectedItemIndex(undefined);
    setItems(itemsTemp);
  };

  return (
    <View>
      <Center p={5}>
        <Heading>Create new wishlist:</Heading>
        <FormControl>
          <FormControl.Label>Wishlist title</FormControl.Label>
          <Input
            isRequired={true}
            type="text"
            placeholder="Enter a title"
            value={title}
            onChangeText={setTitle}
          />

          <FormControl.Label>Description</FormControl.Label>
          <TextArea
            placeholder="Type out a description for your wishlist"
            autoCompleteType={"off"}
            value={description}
            onChangeText={setDescription}
          />

          <FormControl.Label>Items</FormControl.Label>
          <Flex flexDirection="row">
            <Box
              flex={3}
              borderColor="gray.300"
              borderWidth={1}
              rounded="md"
              bg="white"
            >
              <ScrollView height={160} rounded="md">
                <VStack flex={1}>
                  {items.map((itemText: string, index: number) => (
                    <ItemsListItem
                      itemText={itemText}
                      index={index}
                      selectedIndex={selectedItemIndex}
                      onPress={setSelectedItemIndex}
                    />
                  ))}
                </VStack>
              </ScrollView>
            </Box>
            <VStack
              flex={1}
              bg="white"
              marginLeft={2}
              rounded="md"
              borderColor="gray.300"
              borderWidth={1}
            >
              <Button flex={1} m={2} onPress={() => setShowModal(true)}>
                +
              </Button>
              <Button
                flex={1}
                marginX={2}
                marginBottom={2}
                isDisabled={selectedItemIndex === undefined}
                bg="red.500"
                onPress={onDeleteItemPressed}
              >
                -
              </Button>
            </VStack>
          </Flex>
          <Button m={5} isLoading={isPending} onPress={onCreateWishlistPressed}>
            CREATE WISHLIST
          </Button>
          <CreateItemModal
            showModal={showModal}
            setShowModal={setShowModal}
            onConfirm={onModalConfirmed}
          />
        </FormControl>
      </Center>
    </View>
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

const ItemsListItem = ({
  index,
  itemText,
  selectedIndex,
  onPress,
}: {
  index: number;
  itemText: string;
  selectedIndex?: number;
  onPress?: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  return (
    <Pressable
      key={index}
      onPress={() => {
        if (onPress) {
          if (index === selectedIndex) {
            onPress(undefined);
          } else {
            onPress(index);
          }
        }
      }}
    >
      <Box
        flex={1}
        p={2}
        bg={
          selectedIndex !== undefined && selectedIndex === index
            ? "gray.400"
            : index % 2 === 0
            ? "gray.50"
            : "gray.200"
        }
      >
        <Text
          fontWeight={
            selectedIndex !== undefined && selectedIndex === index
              ? "semibold"
              : "normal"
          }
        >
          {itemText}
        </Text>
      </Box>
    </Pressable>
  );
};

export default CreateNewListPage;
