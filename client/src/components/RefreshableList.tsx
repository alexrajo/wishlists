import { View, Text, FlatList, Button, Center } from "native-base";
import React, { useEffect, useState } from "react";
import { GestureResponderEvent, ListRenderItemInfo, RefreshControl, StyleSheet } from "react-native";
import ListButton from "./ListButton";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { HOST } from "../config/variables";

const RefreshableList = ({children, endpoint, placeholder, onPress}: {children?: React.ReactNode, endpoint: string, placeholder?: React.ReactNode, onPress?: ((data: any) => void) | null | undefined}) => {
    const {authToken} = useAuth();

    const newRequestObject = () => {
        return new Request(
            HOST + endpoint,
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
    }, [authToken, endpoint]);

    return (
        <View>
            <Center>
                {fetchError && <Text color={"red.500"}>{fetchError}</Text>}
                {data && data.length < 1 && placeholder}

                {!fetchError ?
                <>
                    <FlatList 
                        style={styles.list} 
                        data={data} 
                        renderItem={(itemData: ListRenderItemInfo<Wishlist>) => renderListPreview(itemData, onPress)} 
                        keyExtractor={item => item.wishlistId.toString()}
                        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refresh}/>}
                        height="100%"
                    />
                    {children}
                </>
                : <Button onPress={refresh}>Try again</Button>
                }
            </Center>
        </View>
    );
}

const renderListPreview = (itemData: ListRenderItemInfo<Wishlist>, onPress?: ((data: any) => void) | null | undefined) => (
    <ListButton onPress={() => {
        if (!onPress) return;
        onPress(itemData.item)
    }}>
        <Text fontSize={"md"} fontWeight={"semibold"}>{itemData.item.title}</Text>
        <Text>{itemData.item.description}</Text>
    </ListButton>
);

const styles = StyleSheet.create({
    list: {
        width: "100%",
    },
});

export default RefreshableList;