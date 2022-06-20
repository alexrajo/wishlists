import { View, Box, HStack, Text, Divider, Fab, Icon, Center, Spinner } from "native-base";
import { useState } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useAuth from "../../../../hooks/useAuth";
import RefreshableList from "../../../../components/RefreshableList";
import { Friendship, ListItemRenderer } from "../../../../config/types";
import ListButton from "../../../../components/ListButton";

const FriendsOverview = ({navigation}: any) => {
    const {userData} = useAuth();
    const [selectedSection, setSelectedSection] = useState(0);

    const onAddFriendPressed = () => {
        navigation.navigate("AddFriend");
    }

    const friendshipListItemRenderer: ListItemRenderer<Friendship> = ({item: friendship}) => {        
        if (userData === undefined) return null;
        switch (selectedSection) {
            case 1:
                return !friendship.confirmed && 
                        friendship.initiator !== undefined &&
                        friendship.receiverId === userData.userId ? 
                            <ListButton><Text>@{friendship.initiator.username}</Text></ListButton> 
                        : null;
            case 2:
                return !friendship.confirmed && 
                        friendship.receiver !== undefined &&
                        friendship.initiatorId === userData.userId ? 
                            <ListButton><Text>@{friendship.receiver.username}</Text></ListButton> 
                        : null;
            default:
                return friendship.confirmed && 
                        friendship.initiator !== undefined && 
                        friendship.receiver !== undefined ? 
                            <ListButton><Text>@{friendship.initiatorId === userData.userId ? friendship.receiver.username : friendship.initiator.username}</Text></ListButton> 
                       : null;
        }
    }

    return (
        <View flex={1}>
            <Box height={10} bg="gray.100" borderBottomColor="gray.300" borderBottomWidth={1}>
                <HStack flex={1} justifyContent="space-evenly" alignItems="center">
                    <Box flex={1} alignItems="center"><Pressable onPress={() => setSelectedSection(0)}>
                        <Text fontWeight={selectedSection === 0 ? "semibold" : "normal"}>Friends</Text>
                    </Pressable></Box>
                    <Divider orientation="vertical" bg="gray.300"/>
                    <Box flex={1} alignItems="center"><Pressable onPress={() => setSelectedSection(1)}>
                        <Text fontWeight={selectedSection === 1 ? "semibold" : "normal"}>Requests</Text>
                    </Pressable></Box>
                    <Divider orientation="vertical" bg="gray.300"/>
                    <Box flex={1} alignItems="center"><Pressable onPress={() => setSelectedSection(2)}>
                        <Text fontWeight={selectedSection === 2 ? "semibold" : "normal"}>Outgoing</Text>
                    </Pressable></Box>
                </HStack>
            </Box>
            <RefreshableList 
                endpoint="/api/friendships" 
                keyExtractor={(friendship: Friendship) => friendship.friendshipId.toString()}
                itemRenderer={friendshipListItemRenderer}
            />
            <Fab onPress={onAddFriendPressed} bg="white" renderInPortal={false} shadow={2} size="md" icon={<Icon color="black" as={AntDesign} name="adduser" size="md"/>}/>
        </View>
    );
}

export default FriendsOverview;