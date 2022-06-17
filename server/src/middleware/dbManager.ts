import { Request, Response, NextFunction, json, urlencoded } from "express";
import { PrismaClient, User, Friendship, Wishlist } from "@prisma/client";
import { AuthenticationRequest, AuthorizationRequest, SignedUserData } from "../config/types";
import { hashPassword } from "./auth";

const bcrypt = require("bcrypt");

const illegalUsernameFormat = /[!-\/:-@[-`{-~ *+]/;
const prisma = new PrismaClient();

const stringifyComplexJSON = (data: any) => {
    return JSON.stringify(data, (_key, value) => typeof value === 'bigint' ? value.toString() : value)
}

const isValidEmail = (email: string) => {
    const atMatches = email.match("@");
    if (atMatches == null || atMatches.length > 1) return false;
    return true;
}

export const setUserRefreshToken = async (user: User, token: string) => {
    try {
        await prisma.user.update({
            where: {userId: user.userId},
            data: {token: token}
        });
        return true;
    } catch {
        return false;
    }
}

export const getUserFromSignedData = async (user: SignedUserData) => {
    try {
        const foundUser = await prisma.user.findFirst({where: {
            userId: user.userId,
        }});
        return foundUser;
    } catch {
        return null;
    }
}

export const getUserFromLoginInformation = async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    try {
        const {username, email, password} = req.body;
        if ((!username && !email) || !password) return res.status(400).json("Missing input!");

        req.user = await prisma.user.findFirst({
            where: {
                OR : [
                    { username: username },
                    { email: email },
                ]
            }
        })
        next();
    } catch {
        res.status(500).send("Could not get user from login information. Check that the info you put in is correct.");
    }
}

export const retrieveUserLists = async (req: AuthorizationRequest, res: Response) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    try {
        const lists = await prisma.wishlist.findMany({
            where: {
                ownerId: user.userId,
            }
        });
        const formattedLists = stringifyComplexJSON(lists);
        return res.status(200).json(JSON.parse(formattedLists));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const getFriends = async (req: AuthorizationRequest, res: Response) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                confirmed: true,
                OR: [
                    {initiatorId: user.userId},
                    {receiverId: user.userId},
                 ]
            }
        });
        const friendIds = friendships.map(
            (friendship: Friendship) => friendship.initiatorId == user.userId ? friendship.receiverId : friendship.initiatorId
        );
        const friends = await prisma.user.findMany({
            where: {
                userId: {in: friendIds},
            },
            select: {
                userId: true,
                username: true,
                firstName: true,
                lastName: true,
            }
        });
        const formattedLists = stringifyComplexJSON(friends);
        return res.status(200).json(JSON.parse(formattedLists));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const getOwnProfile = async (req: AuthorizationRequest, res: Response) => {
    const signedUserData = req.user;
    if (!signedUserData) return res.sendStatus(401);

    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: signedUserData.userId,
            },
            select: {
                username: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                email: true,
                userRoles: true,
            }
        });
        if (!user) return res.status(500).send("An unknown error occurred while trying to find user info.");
        const formattedUser = stringifyComplexJSON(user);
        
        return res.status(200).json(JSON.parse(formattedUser));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const registerUser = async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const {username, password, firstName, lastName, dateOfBirth, email}: {username: string, password: string, firstName: string, lastName: string, dateOfBirth: string, email?: string} = req.body;
        if (!(username && password && firstName && lastName && dateOfBirth) || (username && username.length < 1)) return res.status(400).send("Missing input!");
        if (illegalUsernameFormat.test(username)) return res.status(400).send("Invalid username!");
        if (email !== undefined && email.length >= 3 && !isValidEmail(email)) return res.status(400).send("Invalid email!");
        if (password.length < 8) {
            return res.status(400).send("Invalid password! Password cannot be shorter than 8 characters.");
        }

        const hashedPassword: string = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: new Date(dateOfBirth),
                email: email !== undefined && email.length >= 3 ? email.toLowerCase() : undefined,
            }
        });

        if (!newUser) return res.status(500).send("Could not create user due to an unknown error.");

        await prisma.userRole.create({
            data: {
                userId: newUser.userId,
                rolename: "user",
            }
        });

        req.user = newUser;
        next();
    } catch(e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const logoutUser = async (req: AuthorizationRequest, res: Response) => {
    if (!req.user) return res.sendStatus(500);

    const updateUser = await prisma.user.update({
        where: {
            userId: req.user.userId,
        },
        data: {
            token: null,
        }
    });
    return res.sendStatus(200);
}

export const createWishlist = async (req: AuthorizationRequest, res: Response) => {
    const { title, description } = req.body;
    if (!title) return res.sendStatus(400);

    const user = req.user;
    if(!user) return res.sendStatus(500);

    const newWishlist = await prisma.wishlist.create({
        data: {
            ownerId: user.userId,
            title: title,
            description: description,
        }
    });
    if (!newWishlist) return res.sendStatus(500);
    return res.status(200).send("Wishlist created!");
}