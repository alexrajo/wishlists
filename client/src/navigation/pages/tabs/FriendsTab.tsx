import { View, Box, HStack, Text, Divider, Fab, Icon } from "native-base";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import RefreshableList from "../../../components/RefreshableList";

const FriendsTab = () => {
    const [selectedSection, setSelectedSection] = useState(0);
    const [endpoint, setEndpoint] = useState("/api/friends");

    useEffect(() => {
        switch (selectedSection) {
            case (0):
                setEndpoint("/api/friends");
                break;
            case (1):
                setEndpoint("/api/friendrequests");
                break;
            case (2):
                setEndpoint("/api/outgoingfriendrequests");
                break;
            default:
                setEndpoint("/api/friends");
                break;
        }
    }, [selectedSection]);

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
            <RefreshableList endpoint={endpoint} placeholder={<Text>This page is empty, send a friend request to someone!</Text>}/>
            <Fab bg="white" renderInPortal={false} shadow={2} size="md" icon={<Icon color="black" as={AntDesign} name="adduser" size="md"/>}/>
        </View>
    );
}

export default FriendsTab;