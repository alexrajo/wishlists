import { View, Text, FlatList, Button, Center } from "native-base";
import React, { useEffect, useState } from "react";
import { GestureResponderEvent, ListRenderItemInfo, RefreshControl, StyleSheet } from "react-native";
import ListButton from "./ListButton";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { HOST } from "../config/variables";

const RefreshableList = ({children, endpoint, placeholder, keyExtractor, itemDataToContent, onPress}: {children?: React.ReactNode, endpoint: string, placeholder?: React.ReactNode, keyExtractor: (arg0: any) => string, itemDataToContent: (arg0: ListRenderItemInfo<any>) => React.ReactNode, onPress?: ((data: any) => void) | null | undefined}) => {
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
                        renderItem={(itemData: ListRenderItemInfo<any>) => renderListPreview(itemData, itemDataToContent, onPress)} 
                        keyExtractor={keyExtractor}
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

const renderListPreview = (itemData: ListRenderItemInfo<any>, itemDataToContent: (arg0: ListRenderItemInfo<any>) => React.ReactNode, onPress?: ((data: any) => void) | null | undefined) => (
    <ListButton onPress={() => {
        if (!onPress) return;
        onPress(itemData.item)
    }}>
        {itemDataToContent(itemData)}
    </ListButton>
);

const styles = StyleSheet.create({
    list: {
        width: "100%",
    },
});

export default RefreshableList;