import { Center, Heading, View, Text, FlatList, Box, CircleIcon, HStack, Button, Pressable, MinusIcon } from "native-base";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ListViewingPage = ({route, goBack}: {route: {params: {wishlist: Wishlist}}, goBack?: () => void}) => {
    const {wishlist} = route.params;
    const items = wishlist.items;
    const isOwnWishlist = true;
    
    return (
        <View flex={1}>
            <Center flex={1} paddingTop={5}>
                <Heading>{wishlist.title}</Heading>
                <Text>{wishlist.description}</Text>
                <FlatList 
                    marginTop={5}
                    style={styles.list} 
                    data={items} 
                    renderItem={(itemData: ListRenderItemInfo<Item>) => <WishlistItemComponent itemInfo={itemData.item} isOwn={isOwnWishlist}/>} 
                    keyExtractor={item => item.itemId.toString()}
                />
            </Center>
            <Pressable position="absolute" right={5} top={5}>
                <MaterialIcons name="delete-forever" color="red" size={32}/>
            </Pressable>
        </View>
    );
}

const WishlistItemComponent = ({itemInfo, isOwn}: {itemInfo: Item, isOwn: boolean}) => {
    const displayAsClaimed = !isOwn && itemInfo.claimedById !== undefined;
    
    return (
        <Box m={2} paddingBottom={2} flex={1} borderBottomColor="gray.300" borderBottomWidth="1">
            <HStack alignItems="center" space={2}>
                <CircleIcon color="black" size="xs" flex={1}/>
                <View flexDirection="row" flex={5}>
                    <Text 
                        fontSize="lg" 
                        textDecorationLine={displayAsClaimed ? "line-through" : "none"}
                        color={displayAsClaimed ? "gray.400" : "black"}
                    >  
                        {itemInfo.name}
                    </Text>
                    {displayAsClaimed && <Text color="gray.400" fontSize="lg" fontStyle="italic">       Claimed</Text>}
                </View>
                {!displayAsClaimed && !isOwn && <View flex={2}><Button alignSelf="flex-end">Claim</Button></View>}
            </HStack>
        </Box>
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: "white",
        width: "80%",
    }
});

export default ListViewingPage;