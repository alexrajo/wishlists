import { Fab, Icon, Text } from "native-base";
import { GestureResponderEvent, ListRenderItemInfo, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RefreshableList from "../../../../components/RefreshableList";

const MyListsOverview = ({navigation}: {navigation: any}) => {

    const onListElementPressed = (data?: Wishlist) => {
        if (!data) return;
        navigation.navigate("ViewList", 
            {
                wishlist: data,
            }
        );
    }

    const itemDataToContent = (itemData: ListRenderItemInfo<any>) => {
        return (
            <>
                <Text fontSize={"md"} fontWeight={"semibold"}>{itemData.item.title}</Text>
                <Text>{itemData.item.description}</Text>
            </>
        )
    }

    return (
        <>
            <RefreshableList 
                onPress={onListElementPressed} 
                endpoint="/api/mylists" 
                itemDataToContent={itemDataToContent} 
                keyExtractor={(item: Wishlist) => item.wishlistId.toString()} 
                placeholder={<Text>Looks like you haven't made any wishlists yet. Create one now!</Text>}
            />
            <Fab bg="white" onPress={() => navigation.navigate("Create")} renderInPortal={false} shadow={2} size="md" icon={<Icon color="black" as={Ionicons} name="add" size="md"/>}/>
        </>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        width: 180,
        position: "absolute",
        bottom: 30,
    },
});

export default MyListsOverview;