import { View, Center, Heading, FormControl, Input, TextArea, ScrollView, Radio, Flex , Box, Button, Modal, Text, VStack} from "native-base";
import { useState } from "react";
import useAuth from "../../../../hooks/useAuth";

const CreateNewListPage = ({navigation}: any) => {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [isPending, setIsPending] = useState(false);
    const {authToken, refreshAuthToken} = useAuth();

    const onCreateWishlistPressed = () => {
        if (!title) return;
        setIsPending(true);
        fetch("http://10.0.0.26:3001/api/createlist", {
            method: "POST",
            mode: "cors",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "Authorization": `JWT ${authToken}`,
            },
            body: JSON.stringify({
                title: title,
                description: description,
            })
        }).then((res: Response) => {
            if (res.status === 401) refreshAuthToken();
            if (!res.ok) throw new Error("Could not create wishlist");
            navigation.navigate("Overview")
        }).catch(e => {
            console.error(e);
        }).finally(() => setIsPending(false));
    }

    return (
        <View>
            <Center p={5}>
                <Heading>Create new wishlist:</Heading>
                <FormControl>
                    <FormControl.Label>Wishlist title</FormControl.Label>
                    <Input isRequired={true} type="text" placeholder="Enter a title" value={title} onChangeText={setTitle}/>
                    
                    <FormControl.Label>Description</FormControl.Label>
                    <TextArea placeholder="Type out a description for your wishlist" autoCompleteType={"off"} value={description} onChangeText={setDescription}/>

                    <FormControl.Label>Theme color</FormControl.Label>
                    <Radio.Group name="themeColorGroup" defaultValue="0">
                        <Flex flexDirection="row">
                            <Box flex={10}><Radio value="0">Default</Radio></Box>
                            <Box flex={7}><Radio value="1">Blue</Radio></Box>
                            <Box flex={8}><Radio value="2">Green</Radio></Box>
                            <Box flex={6}><Radio value="3">Red</Radio></Box>
                        </Flex>
                    </Radio.Group>

                    <FormControl.Label>Items</FormControl.Label>
                    <Flex flexDirection="row">
                        <Box flex={3}><ScrollView height={160} bg="white" rounded="md"/></Box>
                        <VStack flex={1} bg="white" marginLeft={2} rounded="md">
                            <Button flex={1} m={2} onPress={() => setShowModal(true)}>+</Button>
                            <Button flex={1} marginX={2} marginBottom={2} isDisabled bg="red.500">-</Button>
                        </VStack>
                    </Flex>
                    <Button m={5} isLoading={isPending} onPress={onCreateWishlistPressed}>CREATE WISHLIST</Button>
                    <CreateItemModal showModal={showModal} setShowModal={setShowModal}/>
                </FormControl>
            </Center>
        </View>
    );
}

const CreateItemModal = ({showModal, setShowModal}: {showModal: boolean, setShowModal: (b: boolean) => void}) => (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="80%">
            <Modal.CloseButton/>
            <Modal.Header>Add item to wishlist</Modal.Header>
            <Modal.Body>
                <VStack>
                    <Text>Text</Text>
                    <Input isRequired type="text" placeholder="Item name and description"/>
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <Button.Group space={2}>
                    <Button variant="ghost" onPress={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button onPress={() => setShowModal(false)}>
                        Add
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
)

export default CreateNewListPage;