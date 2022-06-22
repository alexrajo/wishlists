import { Pressable, View, Box, Text, ChevronRightIcon } from "native-base";
import { ILinearGradientProps } from "native-base/lib/typescript/components/primitives/Box/types";
import { ColorType, ResponsiveValue } from "native-base/lib/typescript/components/types";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ReactChildrenProp } from "../config/types";

export const ListButton = ({children, onPress}: {children: ReactChildrenProp, onPress?: (() => void) | null | undefined}) => {

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

export const ListBox = ({children, menucomponents, bg}: {children?: ReactChildrenProp, menucomponents?: ReactChildrenProp, bg?: ResponsiveValue<ColorType | (string & {}) | ILinearGradientProps>}) => {
    return (
        <Box style={styles.wrapper} bg={bg || "white"}>
            <View style={styles.content}>
                <Box>
                    {children}
                </Box>
                {menucomponents}
            </View>
        </Box>
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