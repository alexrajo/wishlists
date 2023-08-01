import { View, Center, Heading, FormControl, Input, TextArea, Button } from "native-base";
import { useState } from "react";
import { useUser } from "../../../../hooks/useUser";
import { HOST } from "../../../../config/variables";

const CreateNewListPage = ({ navigation }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const [items, setItems] = useState<Array<string>>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>();
  const { authToken, refreshAuthToken } = useUser();

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

  return (
    <View>
      <Center p={5}>
        <Heading>Create new wishlist:</Heading>
        <FormControl>
          <FormControl.Label>Wishlist title</FormControl.Label>
          <Input isRequired={true} type="text" placeholder="Enter a title" value={title} onChangeText={setTitle} />

          <FormControl.Label>Description</FormControl.Label>
          <TextArea
            placeholder="Type out a description for your wishlist"
            autoCompleteType={"off"}
            value={description}
            onChangeText={setDescription}
          />

          <Button m={5} isLoading={isPending} onPress={onCreateWishlistPressed}>
            CREATE WISHLIST
          </Button>
        </FormControl>
      </Center>
    </View>
  );
};

export default CreateNewListPage;
