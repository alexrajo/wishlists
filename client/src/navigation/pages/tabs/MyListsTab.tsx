import { View, Heading, Text, FlatList, Box, Button, Center, ChevronRightIcon, Skeleton, VStack, ScrollView, Spacer } from "native-base";
import React, { useEffect, useState } from "react";
import { ListRenderItemInfo, Pressable, RefreshControl, StyleSheet } from "react-native";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";

const MyListsTab = () => {
    const {authToken} = useAuth();

    const newRequestObject = () => {
        return new Request(
            "http://10.0.0.26:3001/api/mylists",
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${authToken}`,
                }
            }
        );
    }

    const [request, setRequest] = useState(newRequestObject());
    const {data, error: fetchError, isPending, refresh} = useFetch(request);

    useEffect(() => {
        setRequest(newRequestObject());
    }, [authToken]);

    return (
        <View>
            <Center>
                {/*isPending && wishlistPreviewSkeleton()*/}
                {fetchError && <Text color={"red.500"}>{fetchError}</Text>}
                {data && data.length < 1 && <Text>Looks like you haven't made any wishlists yet. Create one now!</Text>}

                {!fetchError ?
                <>
                    <FlatList 
                        style={styles.list} 
                        data={data} 
                        renderItem={renderListPreview} 
                        keyExtractor={item => item.wishlistId.toString()}
                        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refresh}/>}
                        height="100%"
                    />
                    {!isPending && <Button style={styles.floatingButton}>CREATE NEW</Button>}
                </>
                : <Button onPress={refresh}>Try again</Button>
                }
            </Center>
        </View>
    );
}

const renderListPreview = (itemData: ListRenderItemInfo<Wishlist>) => (
    <Pressable style={styles.wishlistPreview}>
        <View style={styles.wishlistPreviewContentContainer}>
            <Box>
                <Text fontSize={"md"} fontWeight={"semibold"}>{itemData.item.title}</Text>
                <Text>{itemData.item.description}</Text>
            </Box>
            <ChevronRightIcon size={9}/>
        </View>
    </Pressable>
);

const wishlistPreviewSkeleton = () => (
    <View w="100%" paddingTop={5}>
        <VStack w="100%" style={{alignItems: "center"}} space={5}>
            {
                [1, 2, 3, 4, 5, 6].map((key) => 
                <Box borderWidth={1} rounded="md" p={2} h="60" w="95%" borderColor="gray.300" key={key}>
                    <VStack space={1}>
                        <Skeleton rounded="md" h="45%" w="30%" startColor="gray.300"/>
                        <Skeleton rounded="md" h="45%" w="60%" startColor="gray.300"/>
                    </VStack>
                </Box>
                )
            }
        </VStack>
    </View>
);

const styles = StyleSheet.create({
    floatingButton: {
        width: 180,
        position: "absolute",
        top: 490,
    },

    list: {
        width: "100%",
    },

    wishlistPreview: {
        padding: 10,
        margin: 10,
        height: 60,
        borderRadius: 10,
        backgroundColor: "white",
    },

    wishlistPreviewContentContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

export default MyListsTab;