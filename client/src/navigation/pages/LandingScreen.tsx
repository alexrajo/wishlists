import { Center, Text, View, Box, Heading, FormControl, VStack, Input, Button } from "native-base";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import useFetch from "../../hooks/useFetch";

const backgroundImage = {
    uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5c584b48-4197-41f4-a5dc-a51f51bc8ce8/d68dvv6-5dccbde6-5ced-4f2d-acce-4d3a704b75e2.jpg/v1/fill/w_1024,h_1457,q_75,strp/paper_texture_by_evusha_d68dvv6-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQ1NyIsInBhdGgiOiJcL2ZcLzVjNTg0YjQ4LTQxOTctNDFmNC1hNWRjLWE1MWY1MWJjOGNlOFwvZDY4ZHZ2Ni01ZGNjYmRlNi01Y2VkLTRmMmQtYWNjZS00ZDNhNzA0Yjc1ZTIuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.xOpl7vhawVO1govL8AMvbjX7Q_4WdP3C5VR62UES2UU",
};

const LandingScreen = (props: any) => {
    //const {data: authResponse, error: authError, isPending: authIsPending} = useFetch("/api/init");

    const onGoToRegisterScreenPressed = () => {
        props.navigation.navigate("Register");
    }

    const onGoToLoginScreenPressed = () => {
        props.navigation.navigate("Login");
    }

    return (
        <View style={styles.container}>
            <ImageBackground style={{flex: 1, height: "100%"}} source={backgroundImage}>
                <Center style={styles.container} p={15}>
                    <Box alignItems={"center"}>
                        <Heading>Welcome! Let's get started.</Heading>
                        <Button onPress={onGoToRegisterScreenPressed}>SIGN UP</Button>
                        <Text fontSize={"md"}>Already have an account?</Text>
                        <Button onPress={onGoToLoginScreenPressed}>LOG IN</Button>
                    </Box>
                </Center>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default LandingScreen;