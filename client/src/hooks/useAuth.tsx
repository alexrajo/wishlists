import {
  useEffect,
  useState,
  useContext,
  createContext,
  Component,
  Context,
} from "react";
import * as SecureStore from "expo-secure-store";
import { HOST } from "../config/variables";
import {
  AuthenticationResponse,
  SignedUserData,
  SignUpData,
  User,
} from "../config/types";

interface AuthContextInterface {
  loggedIn: boolean;
  isPending: boolean;
  error?: string;
  authToken?: string;
  userData?: SignedUserData;
  login: (username: string, password: string) => void;
  logout: () => void;
  signup: (signUpData: SignUpData) => void;
  refreshAuthToken: () => void;
}

const refreshTokenSecureStoreKey = "refreshToken";
const AuthContext = createContext<AuthContextInterface>({
  loggedIn: false,
  isPending: true,
  error: "",
  authToken: "",
  login: (username: string, password: string) => {},
  logout: () => {},
  signup: (signUpData: SignUpData) => {},
  refreshAuthToken: () => {},
});

const getValueFromKey = async (key: string) => {
  const result = await SecureStore.getItemAsync(key);
  return result || undefined;
};

export const ProvideAuth = ({ children }: any) => {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth} key={1}>
      {children}
    </AuthContext.Provider>
  );
};

const useProvideAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>();
  const [refreshToken, setRefreshToken] = useState<string | undefined>();
  const [userData, setUserData] = useState<User>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

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
      .then((data: AuthenticationResponse) => {
        setRefreshToken(data.refreshToken);
        setAuthToken(data.authToken);
        setUserData(data.userData);
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
        if (!res.ok)
          throw new Error(`Could not log out! Status: ${res.status}`);
        SecureStore.deleteItemAsync(refreshTokenSecureStoreKey)
          .then(() => {
            setLoggedIn(false);
            setUserData(undefined);
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
        throw new Error(
          "Could either not register or authenticate! Try logging in to account."
        );
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
        setUserData(data.userData);
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

  return {
    loggedIn,
    authToken,
    error,
    isPending,
    userData,
    login,
    logout,
    signup,
    refreshAuthToken,
  };
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
