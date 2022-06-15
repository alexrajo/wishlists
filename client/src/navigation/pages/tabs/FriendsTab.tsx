import { View, Box, HStack, Text, Divider, FlatList } from "native-base";
import { Pressable } from "react-native";

const FriendsTab = () => {
    return (
        <View flex={1}>
            <Box height={10} bg="gray.100" borderBottomColor="gray.300" borderBottomWidth={1}>
                <HStack flex={1} justifyContent="space-evenly" alignItems="center">
                    <Box flex={1} alignItems="center"><Pressable><Text>Friends</Text></Pressable></Box>
                    <Divider orientation="vertical" bg="gray.300"/>
                    <Box flex={1} alignItems="center"><Pressable><Text>Requests</Text></Pressable></Box>
                    <Divider orientation="vertical" bg="gray.300"/>
                    <Box flex={1} alignItems="center"><Pressable><Text>Outgoing</Text></Pressable></Box>
                </HStack>
            </Box>
            <FlatList renderItem={() => <Box/>} data={[]} flex={1}></FlatList>
        </View>
    );
}

export default FriendsTab;