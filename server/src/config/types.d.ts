import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

export interface SignedUserData {
  userId: number;
  username: string | String;
}

export interface AuthenticationRequest extends Request {
  user?: User | null;
}

export interface AuthorizationRequest extends Request {
  user?: SignedUserData | null;
  token?: string;
}

export interface UserIdBasedConditionalRequest extends AuthorizationRequest {
  targetUserId?: number;
}
