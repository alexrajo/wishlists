import { useEffect, useState, useContext, createContext, Component, Context } from "react";
import * as SecureStore from "expo-secure-store";
import { HOST } from "../config/variables";
import { AuthResponse, SignUpData } from "../config/types";
import { useAppDispatch, useAppSelector } from "./useAppRedux";
import { setAuthTokenReducer, setLoggedInReducer } from "../redux/auth";

const refreshTokenSecureStoreKey = "refreshToken";

const getValueFromKey = async (key: string) => {
  const result = await SecureStore.getItemAsync(key);
  return result || undefined;
};

const useAuth = () => {
  const [refreshToken, setRefreshToken] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  const dispatch = useAppDispatch();

  const loggedIn = useAppSelector((state) => state.auth.loggedIn);
  const setLoggedIn = (b: boolean) => dispatch(setLoggedInReducer(b));

  const authToken = useAppSelector((state) => state.auth.authToken);
  const setAuthToken = (t?: string) => dispatch(setAuthTokenReducer(t));

  const login = (usernameOrEmail: string, password: string) => {
    if (isPending) return;
    setError(undefined);
    setIsPending(true);
    fetch(`${HOST}/api/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameOrEmail,
        email: usernameOrEmail,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Could not authenticate!");
      })
      .then((data: AuthResponse) => {
        setRefreshToken(data.refreshToken);
        setAuthToken(data.authToken);
        setLoggedIn(true);
      })
      .catch((e) => {
        setLoggedIn(false);
        setError(e.message);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const logout = () => {
    if (isPending) return;
    setError(undefined);
    setIsPending(true);
    fetch(`${HOST}/api/logout`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `JWT ${refreshToken}`,
      },
    })
      .then((res: Response) => {
        if (!res.ok) throw new Error(`Could not log out! Status: ${res.status}`);
        SecureStore.deleteItemAsync(refreshTokenSecureStoreKey)
          .then(() => {
            setLoggedIn(false);
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((e) => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const signup = (signUpData: SignUpData) => {
    if (isPending) return;
    setError(undefined);
    setIsPending(true);
    fetch(`${HOST}/api/register`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Could either not register or authenticate! Try logging in to account.");
      })
      .then((data) => {
        setRefreshToken(data.refreshToken);
        setAuthToken(data.authToken);
        setLoggedIn(true);
      })
      .catch((e) => {
        setLoggedIn(false);
        setError(e.message);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const refreshAuthToken = () => {
    if (isPending) return;
    setError(undefined);
    setIsPending(true);
    fetch(`${HOST}/api/refreshtoken`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `JWT ${refreshToken}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Could not refresh, please log in again!");
      })
      .then((data) => {
        setAuthToken(data.authToken);
        setLoggedIn(true);
      })
      .catch((e) => {
        setLoggedIn(false);
        setError(e.message);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  useEffect(() => {
    if (refreshToken) {
      refreshAuthToken();
      SecureStore.setItemAsync(refreshTokenSecureStoreKey, refreshToken);
    }
  }, [refreshToken]);

  useEffect(() => {
    getValueFromKey(refreshTokenSecureStoreKey).then(setRefreshToken);
  }, []);

  return { loggedIn, authToken, error, isPending, login, logout, signup, refreshAuthToken };
};

export default useAuth;
