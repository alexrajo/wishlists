import { ParamListBase } from "@react-navigation/native";
import React from "react";
import { ListRenderItemInfo } from "react-native";

export interface CondensedUser {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface User extends CondensedUser {
  email?: string;
  dateOfBirth?: Date;
}

export interface DisplayableUserInfo extends Omit<User, "userId"> {}

export interface SignUpData extends Partial<DisplayableUserInfo> {
  password?: string;
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

export type OptionalUserData = Partial<User>;

export interface Friendship {
  friendshipId: number;
  initiatorId: number;
  receiverId: number;
  confirmed: boolean;
  receiver?: CondensedUser;
  initiator?: CondensedUser;
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
  userData?: User;
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
