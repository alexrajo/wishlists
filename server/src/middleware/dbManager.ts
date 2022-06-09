import { Request, Response, NextFunction, json, urlencoded } from "express";
import { PrismaClient, User, Friendship } from "@prisma/client";
import { AuthenticationRequest, AuthorizationRequest, SignedUserData } from "../config/types";

const illegalUsernameFormat = /[!-\/:-@[-`{-~ ]/;
const prisma = new PrismaClient();

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
        res.sendStatus(500);
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
        const formattedLists = JSON.stringify(lists, (_key, value) => typeof value === "bigint" ? value.toString() : value);
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
        const formattedLists = JSON.stringify(friends, (_key, value) => typeof value === "bigint" ? value.toString() : value);
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

        return res.status(200).json(user);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const registerUser = async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    try {
        const {username, password, firstName, lastName, dateOfBirth, email} = req.body;
        if (!(username && password && firstName && lastName && dateOfBirth)) return res.status(400).send("Missing input!");
        if(illegalUsernameFormat.test(username)) return res.status(400).send("Invalid username!");
        if (password.length < 8) {
            return res.status(400).send("Invalid password! Password cannot be shorter than 8 characters.");
        }

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: new Date(dateOfBirth),
                email: email,
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

export const createWishlist = async (req: AuthorizationRequest, res: Response) => {
    const { title, description, content } = req.body;
    if (!title) return res.sendStatus(400);

    const user = req.user;
    if(!user) return res.sendStatus(500);

    const newWishlist = await prisma.wishlist.create({
        data: {
            ownerId: user.userId,
            title: title,
            description: description,
            content: content,
        }
    });
    if (!newWishlist) return res.sendStatus(500);
    return res.status(200).send("Wishlist created!");
}