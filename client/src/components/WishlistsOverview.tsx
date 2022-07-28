import { Text } from "native-base";
import RefreshableList from "./RefreshableList";
import {ListButton} from "./ListElements";
import { ListItemRenderer, Wishlist } from "../config/types";

const MyListsOverview = ({navigation, endpoint}: {navigation: any, endpoint: string}) => {

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
                endpoint={endpoint}
                keyExtractor={(item: Wishlist) => item.wishlistId.toString()} 
                placeholder={<Text>Couldn't find any wishlists!</Text>}
                itemRenderer={listItemRenderer}
            />
        </>
    );
}

export default MyListsOverview;