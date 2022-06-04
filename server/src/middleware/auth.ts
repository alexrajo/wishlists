import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { AuthenticationRequest, AuthorizationRequest, SignedUserData } from "../config/types";
import { getUserFromSignedData, setUserRefreshToken } from "./dbManager";

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const getAuthToken = (req: AuthorizationRequest, res: Response) => {
    const headers = req.headers;
    const authHeader = headers["authorization"];
    if (!authHeader) return res.sendStatus(400);

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).send("Could not find token!");

    return token;
}

const userDataToSignableUserData = (user: User): SignedUserData => {
    return {
        userId: user.userId,
        username: user.username,
    }
}

export const authenticateUser = async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const {password} = req.body;
        if (!user || !password) return res.sendStatus(400);

        const passwordMatches = bcrypt.compare(password, user.password);
        if (passwordMatches) {
            const dataToSign: SignedUserData = userDataToSignableUserData(user);

            const newRefreshToken = jwt.sign(dataToSign, REFRESH_TOKEN_SECRET, {expiresIn: "14d"});
            const newAuthToken = jwt.sign(dataToSign, AUTH_TOKEN_SECRET, {expiresIn: "15m"});
            await setUserRefreshToken(user, newRefreshToken);

            return res.status(200).json({
                refreshToken: newRefreshToken,
                authToken: newAuthToken,
            });
        }
    } catch {
        res.sendStatus(500);
    }
}

export const authorizeToken = (req: AuthorizationRequest, res: Response, next: NextFunction) => {
    try {
        const token = getAuthToken(req, res);
        jwt.verify(token, AUTH_TOKEN_SECRET, (err: JsonWebTokenError, user: SignedUserData) => {
            if (err) return res.status(401).send("Could not verify token!");
            
            req.user = user;
            next();
        })
    } catch {
        return res.sendStatus(500);
    }
}

export const refreshToken = async (req: AuthorizationRequest, res: Response) => {
    try {
        const refreshToken = getAuthToken(req, res);
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err: JsonWebTokenError, data: SignedUserData) => {
            if (err) return res.status(401).send("Could not verify token!");
            
            const user = await getUserFromSignedData(data);
            if (!user) return res.sendStatus(401);
            if (refreshToken == user.token) {
                const dataToSign: SignedUserData = userDataToSignableUserData(user);
                const newAuthToken = jwt.sign(dataToSign, AUTH_TOKEN_SECRET, {expiresIn: "15m"});
                return res.status(200).json({
                    authToken: newAuthToken,
                });
            }
            return res.sendStatus(401);
        });
    } catch {
        return res.sendStatus(500);
    }
}