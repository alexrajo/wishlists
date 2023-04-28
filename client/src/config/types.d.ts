import { ParamListBase } from "@react-navigation/native";
import React from "react";
import { ListRenderItemInfo } from "react-native";

export interface SignUpData {
  firstName: string | undefined;
  lastName: string | undefined;
  username: string | undefined;
  email?: string;
  password: string | undefined;
  dateOfBirth: Date;
}

export interface Item {
  itemId: number;
  name: string;
  claimedById?: number;
}

export interface Wishlist {
  wishlistId: number;
  ownerId: number;
  title: string;
  description?: string;
  items: Array<Item>;
}

export interface LimitedUserInfo {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface User extends LimitedUserInfo {
  email?: string;
  dateOfBirth?: Date;
}

export type OptionalUserData = Partial<User>;

export interface Friendship {
  friendshipId: number;
  initiatorId: number;
  receiverId: number;
  confirmed: boolean;
  receiver?: LimitedUserInfo;
  initiator?: LimitedUserInfo;
}

export interface SignedUserData {
  userId: number;
  username: string;
}

export interface AuthorizationResponse {
  authToken?: string;
  refreshToken?: string;
  userData?: SignedUserData;
}

export interface AuthenticationResponse extends AuthorizationResponse {
  userData?: Required<User>;
}

export interface RefreshableListProps {
  children?: React.ReactNode;
  endpoint: string;
  placeholder?: React.ReactNode;
  refreshSignal?: number;
  keyExtractor: (arg0: any) => string;
  itemRenderer: (item: ListRenderItemInfo<any>) => ListRenderItem<any>;
}

export type ListItemRenderer<T> = (
  itemInfo: ListRenderItemInfo<T>
) => JSX.Element | null;
type ReactChildrenProp = React.ReactNode | React.ReactNode[] | undefined;

export interface ProfileStackParams extends ParamListBase {
  Settings: SignUpData;
}

export type HttpRequestMethod = "GET" | "POST" | "PUT" | "DELETE";
