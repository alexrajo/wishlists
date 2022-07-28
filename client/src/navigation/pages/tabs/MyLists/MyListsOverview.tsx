import React from "react";
import WishlistsOverview from "../../../../components/WishlistsOverview";
import { GestureResponderEvent, ListRenderItem, ListRenderItemInfo, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fab, Icon } from "native-base";

const MyListsOverview = ({navigation}: {navigation: any}) => (
    <>
        <WishlistsOverview navigation={navigation} endpoint="/api/mylists"/>
        <Fab bg="white" onPress={() => navigation.navigate("Create")} renderInPortal={false} shadow={2} size="md" icon={<Icon color="black" as={Ionicons} name="add" size="md"/>}/>
    </>
);

export default MyListsOverview;