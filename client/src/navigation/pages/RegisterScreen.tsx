import { Box, Button, Center, FormControl, Heading, Input, Text, View, VStack } from "native-base";
import { PropsWithRef, useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import type {StackScreenProps} from "@react-navigation/stack"

const backgroundImage = {
    uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5c584b48-4197-41f4-a5dc-a51f51bc8ce8/d68dvv6-5dccbde6-5ced-4f2d-acce-4d3a704b75e2.jpg/v1/fill/w_1024,h_1457,q_75,strp/paper_texture_by_evusha_d68dvv6-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQ1NyIsInBhdGgiOiJcL2ZcLzVjNTg0YjQ4LTQxOTctNDFmNC1hNWRjLWE1MWY1MWJjOGNlOFwvZDY4ZHZ2Ni01ZGNjYmRlNi01Y2VkLTRmMmQtYWNjZS00ZDNhNzA0Yjc1ZTIuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.xOpl7vhawVO1govL8AMvbjX7Q_4WdP3C5VR62UES2UU",
};

const RegisterScreen = (props: any) => {
    const [firstName, setFirstName] = useState<string | undefined>();
    const [lastName, setLastName] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [canProceed, setCanProceed] = useState(false);

    const onGoToLoginScreenPressed = () => {
        props.navigation.navigate("Login");
    }

    useEffect(() => {
        setCanProceed(firstName && lastName && username && password ? true : false);
    }, [firstName, lastName, username, password]);

    return (
        <View style={styles.container}>
            <ImageBackground style={{flex: 1, height: "100%"}} source={backgroundImage}>
                <Center style={styles.container} p={15}>
                    <Box alignItems={"center"}>
                        <Heading>CREATE AN ACCOUNT</Heading>
                        <FormControl>
                            <VStack>
                                <FormControl.Label>FIRST NAME</FormControl.Label>
                                <Input 
                                    type="text" placeholder="First name" variant={"filled"} 
                                    value={firstName} onChangeText={setFirstName}
                                />

                                <FormControl.Label>LAST NAME</FormControl.Label>
                                <Input 
                                    type="text" placeholder="Last name" variant={"filled"}
                                    value={lastName} onChangeText={setLastName}
                                />

                                <FormControl.Label>EMAIL (optional)</FormControl.Label>
                                <Input 
                                    type="text" placeholder="Email" variant={"filled"}
                                    value={email} onChangeText={setEmail}
                                />

                                <FormControl.Label>USERNAME</FormControl.Label>
                                <Input 
                                    type="text" placeholder="Username" variant={"filled"}
                                    value={username} onChangeText={setUsername}
                                />
                                <FormControl.HelperText>
                                    Cannot contain special characters (eg. '!', '~')
                                </FormControl.HelperText>

                                <FormControl.Label>PASSWORD</FormControl.Label>
                                <Input 
                                    type="password" placeholder="Password" variant={"filled"}
                                    value={password} onChangeText={setPassword}
                                />
                                <FormControl.HelperText>
                                    Must be atleast 8 characters long
                                </FormControl.HelperText>
                            </VStack>
                        </FormControl>
                        <Button isDisabled={!canProceed}>CREATE ACCOUNT</Button>
                        <Box>
                            <Text fontSize={"lg"}>Already have an account?</Text>
                            <Button onPress={onGoToLoginScreenPressed}>LOG IN</Button>
                        </Box>
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

export default RegisterScreen;