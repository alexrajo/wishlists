import { createContext, useContext, useState } from "react";
import { OptionalUserData } from "../config/types";

type UserDataContextValue =
  | (OptionalUserData & {
      error?: string;
      refreshAllUserData: () => void;
      setAllUserData: (userData: OptionalUserData) => void;
    })
  | null;

type UserDataProviderProps = {
  children?: React.ReactNode;
};

const UserDataContext = createContext<UserDataContextValue>(null);

/**
 * Hook that manages the user data states and functions for updating and reading them
 * @returns {OptionalUserData} an object containing user data, or nothing at all, as well as functions for altering and reading
 */
const useProvideUserData = (): UserDataContextValue => {
  const [userId, setUserId] = useState<number>();
  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [dateOfBirth, setDateOfBirth] = useState<Date>();

  const refreshAllUserData = () => {};
  const setAllUserData = (userData: OptionalUserData) => {
    setUserId(userData.userId);
    setUsername(userData.username);
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setEmail(userData.email);
    setDateOfBirth(userData.dateOfBirth);
  };

  return {
    userId,
    username,
    firstName,
    lastName,
    email,
    dateOfBirth,
    refreshAllUserData,
    setAllUserData,
  };
};

/**
 * A wrapper that provides a context for accessing user data
 * @param props children: the ReactNode children of this element
 * @returns a wrapper that provides user data to all children in it
 */
export const UserDataProvider = (props: UserDataProviderProps) => {
  const { children } = props;
  const userData = useProvideUserData();

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
