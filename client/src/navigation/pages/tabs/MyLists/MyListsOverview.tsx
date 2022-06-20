import { Fab, Icon, Text } from "native-base";
import { GestureResponderEvent, ListRenderItem, ListRenderItemInfo, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RefreshableList from "../../../../components/RefreshableList";
import ListButton from "../../../../components/ListButton";
import { ListItemRenderer, Wishlist } from "../../../../config/types";

const MyListsOverview = ({navigation}: {navigation: any}) => {

    const onListElementPressed = (data?: Wishlist) => {
        if (!data) return;
        navigation.navigate("ViewList", 
            {
                wishlist: data,
            }
        );
    }

    const listItemRenderer: ListItemRenderer<Wishlist> = ({item: wishlist}) => (
        <ListButton onPress={() => onListElementPressed(wishlist)}>
            <Text fontSize={"md"} fontWeight={"semibold"}>{wishlist.title}</Text>
            <Text>{wishlist.description}</Text>
        </ListButton>
    );

    return (
        <>
            <RefreshableList 
                endpoint="/api/mylists" 
                keyExtractor={(item: Wishlist) => item.wishlistId.toString()} 
                placeholder={<Text>Looks like you haven't made any wishlists yet. Create one now!</Text>}
                itemRenderer={listItemRenderer}
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