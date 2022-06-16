import { Pressable, View, Box, Text, ChevronRightIcon } from "native-base";
import { useState } from "react";
import { GestureResponderEvent, StyleSheet } from "react-native";

const ListButton = ({children, onPress}: {children: any, onPress?: ((event?: GestureResponderEvent) => void) | null | undefined}) => {

    const [isPressed, setIsPressed] = useState(false);

    return (
    <Pressable style={styles.wrapper} onPress={onPress} onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} bg={isPressed ? "gray.300" : "white"}>
        <View style={styles.content}>
            <Box>
                {children}
            </Box>
            <ChevronRightIcon size={9}/>
        </View>
    </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        marginTop: 10,
        marginHorizontal: 10,
        height: 60,
        borderRadius: 10,
    },

    content: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
});

export default ListButton;