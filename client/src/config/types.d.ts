import { ListRenderItemInfo } from "react-native";

interface SignUpData {
    firstName: string | undefined,
    lastName: string | undefined,
    username: string | undefined,
    email?: string,
    password: string | undefined,
    dateOfBirth: string | undefined,
}

interface Item {
    itemId: number,
    name: string,
    claimedById?: number,
}

interface Wishlist {
    wishlistId: number,
    title: string,
    description?: string,
    items: Array<Item>,
}

interface User {
    userId: number,
    username: string,
    firstName: string,
    lastName: string,
    email?: string,
}

interface Friendship {
    friendshipId: number,
    initiatorId: number,
    receiverId: number,
    confirmed: boolean,
    receiver?: User,
    initiator?: User,
}

interface SignedUserData {
    userId: number;
    username: string;
}

interface AuthResponse {
    authToken?: string,
    refreshToken?: string,
    userData?: SignedUserData,
}

interface RefreshableListProps {
    children?: React.ReactNode;
    endpoint: string;
    placeholder?: React.ReactNode;
    keyExtractor: (arg0: any) => string;
    itemRenderer: (item: ListRenderItemInfo<any>) => ListRenderItem<any>;
}

type ListItemRenderer<T> = (itemInfo: ListRenderItemInfo<T>) => JSX.Element | null;