import React, { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  View,
  ImageBackground,
} from "react-native";
import {
  NativeBaseProvider,
  Box,
  Center,
  Button,
  VStack,
  Text,
  Input,
  FormControl,
  Heading,
} from "native-base";
import useFetch from "../../hooks/useFetch";

const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:3001";
const backgroundImage = {
  uri: "https://images.rawpixel.com/image_social_portrait/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvZmwzNjI2OTE4MTY0Mi1wdWJsaWMtaW1hZ2Utam9iNTcyLTIuanBn.jpg?s=EnNzeimFebR0mt5wsqhurC7C4VXyFNGhqv2evV2OmfE",
};

const LoginScreen = (props: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState<RequestInfo>(
    new Request(API_ENDPOINT + "/api/login/", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionAuth: true
      }),
    })
  );

  const { data: loginData, error, isPending } = useFetch(requestData);

  const login = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    setRequestData(
      new Request(API_ENDPOINT + "/api/login/", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionAuth: false,
          username: username,
          password: password,
        }),
      })
    );
  };

  useEffect(() => {
    if (loginData && loginData.loggedin) {
      props.navigation.navigate("Main");
    }
  }, [loginData]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Center>
          <Box
            p="12"
            rounded="xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <VStack space={1} alignItems={"center"}>
              <Heading>LOG IN</Heading>
              <FormControl>
                <FormControl.Label>
                  <Text fontSize={"md"} fontWeight="semibold">
                    Username
                  </Text>
                </FormControl.Label>
                <Input
                  variant="filled"
                  onChangeText={setUsername}
                  value={username}
                  placeholder="Enter username..."
                />
                <FormControl.ErrorMessage>
                  That username is already in use!
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text fontSize={"md"} fontWeight="semibold">
                    Password
                  </Text>
                </FormControl.Label>
                <Input
                  variant="filled"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Enter password..."
                />
                <FormControl.ErrorMessage>
                  Password must be longer than 8 characters.
                </FormControl.ErrorMessage>
              </FormControl>
              <br />
              {
                <Button
                  key={"loginButton"}
                  onPress={login}
                  size={"md"}
                  variant={"solid"}
                  colorScheme={"primary"}
                  isLoadingText={"LOGGING IN"}
                  isLoading={loading}
                >
                  LOG IN
                </Button>
              }
            </VStack>
          </Box>
        </Center>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {},
});

export default LoginScreen;
