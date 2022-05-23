import React, { useEffect, useState } from "react";
import { TextInput, StyleSheet, Button, NativeSyntheticEvent, NativeTouchEvent } from "react-native";

const api_endpoint = process.env.API_ENDPOINT || "http://localhost:3001";

const LoginScreen = (props: any) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     fetch("/api/login", {
    //         method: "POST",
    //         mode: "cors",
    //         headers: {
    //             "Accept": "*/*",
    //             "Content-Type": "application/json"
    //         }
    //     })
    // }, [])

    const login = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
        setLoading(true);
        fetch(api_endpoint + "/api/login/", {
            method: "POST", 
            mode: "cors",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
            if (!res.ok) {
                throw new Error("Login failed! " + res.statusText);
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            props.navigation.navigate("Main");
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <div>
            <h2>Log in:</h2>
            <TextInput 
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
            />
            <TextInput 
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
            />
            <br/>
            {loading ? "Loading..." : <Button title="Log in" onPress={login}/>}
        </div>
    );
}

const styles = StyleSheet.create({
    input: {
        width: 200,
        height: 30,
        margin: 12,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 5,
        shadowColor: "#BBBBBB"
    }
});

export default LoginScreen;