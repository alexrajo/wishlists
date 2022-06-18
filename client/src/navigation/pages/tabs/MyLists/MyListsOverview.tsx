import { Fab, Icon, Text } from "native-base";
import { GestureResponderEvent, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RefreshableList from "../../../../components/RefreshableList";

const MyListsOverview = ({navigation}: {navigation: any}) => {

    const onListElementPressed = (data?: Wishlist) => {
        if (!data) return;
        navigation.navigate("ViewList", {wishlist: data});
    }

    return (
        <>
            <RefreshableList onPress={onListElementPressed} endpoint="/api/mylists" placeholder={<Text>Looks like you haven't made any wishlists yet. Create one now!</Text>}/>
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