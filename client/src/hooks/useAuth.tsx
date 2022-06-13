import { useEffect, useState, useContext, createContext, Component } from "react"
import * as SecureStore from 'expo-secure-store';

const refreshTokenSecureStoreKey = "refreshToken";
const AuthContext = createContext({
    loggedIn: false,
    isPending: true,
    error: "",
    authToken: "",
    login: (username: string, password: string) => {},
    signup: (signUpData: SignUpData) => {},
    refreshAuthToken: () => {},
});

const getValueFromKey = async (key: string) => {
    const result = await SecureStore.getItemAsync(key);
    return result;
}

export const ProvideAuth = ({children}: any) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth} key={1}>{children}</AuthContext.Provider>
}

const useProvideAuth = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [authToken, setAuthToken] = useState("");
    const [refreshToken, setRefreshToken] = useState<string | null>();
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);
    
    const login = (username: string, password: string) => {
        setIsPending(true);
        fetch("http://10.0.0.26:3001/api/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Could not authenticate!");
        }).then((data: AuthResponse) => {
            setRefreshToken(data.refreshToken);
            setLoggedIn(true);
        })
        .catch(e => {
            setLoggedIn(false);
            setError(e.message);
        }).finally(() => {
            setIsPending(false);
        });
    }

    const signup = (signUpData: SignUpData) => {
        setIsPending(true);
        fetch("http://10.0.0.26:3001/api/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signUpData),
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Could either not register or authenticate! Try logging in to account.");
        }).then(data => {
            setRefreshToken(data.refreshToken);
            setAuthToken(data.authToken);
            setLoggedIn(true);
        })
        .catch(e => {
            setLoggedIn(false);
            setError(e.message);
        }).finally(() => {
            setIsPending(false);
        });
    }

    const refreshAuthToken = () => {
        setIsPending(true);
        fetch("http://10.0.0.26:3001/api/refreshtoken", {
            method: "POST",
            mode: "cors",
            headers: {
                "Authorization": `JWT ${refreshToken}`
            },
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Could not refresh, please log in again!");
        }).then(data => {
            setAuthToken(data.authToken);
            setLoggedIn(true);
        })
        .catch(e => {
            setLoggedIn(false);
            setError(e.message);
        }).finally(() => {
            setIsPending(false);
        });
    }

    useEffect(() => {
        refreshAuthToken();
        if (refreshToken) {
            SecureStore.setItemAsync(refreshTokenSecureStoreKey, refreshToken);
        }
    }, [refreshToken]);

    useEffect(() => {
        getValueFromKey(refreshTokenSecureStoreKey).then(setRefreshToken);
    }, []);

    return {loggedIn, authToken, error, isPending, login, signup, refreshAuthToken}
}

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;