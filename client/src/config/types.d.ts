import React from "react";
import { ListRenderItemInfo } from "react-native";

interface SignUpData {
    firstName: string | undefined,
    lastName: string | undefined,
    username: string | undefined,
    email?: string,
    password: string | undefined,
    dateOfBirth: Date,
}

interface Item {
    itemId: number,
    name: string,
    claimedById?: number,
}

interface Wishlist {
    wishlistId: number,
    ownerId: number,
    title: string,
    description?: string,
    items: Array<Item>,
}

interface LimitedUserInfo {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
}

interface User extends LimitedUserInfo {
    email?: string;
}

interface Friendship {
    friendshipId: number,
    initiatorId: number,
    receiverId: number,
    confirmed: boolean,
    receiver?: LimitedUserInfo,
    initiator?: LimitedUserInfo,
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
    refreshSignal?: number;
    keyExtractor: (arg0: any) => string;
    itemRenderer: (item: ListRenderItemInfo<any>) => ListRenderItem<any>;
}

type ListItemRenderer<T> = (itemInfo: ListRenderItemInfo<T>) => JSX.Element | null;
type ReactChildrenProp = React.ReactNode | React.ReactNode[] | undefined;