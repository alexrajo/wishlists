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

const isValidEmail = (email: string | undefined) => {
    if (email === undefined) return false;
    const atMatches = email.match("@");
    if (atMatches == null || atMatches.length > 1) return false;
    if (email.length < 3) return false;
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
                    { email: isValidEmail(email) ? email.toLowerCase() : undefined },
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
            },
            include: {
                items: true,
            }
        });
        const formattedLists = stringifyComplexJSON(lists);
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
        if (email !== undefined && email !== "" && !isValidEmail(email)) return res.status(400).send("Invalid email!");
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
                email: isValidEmail(email) ? email!.toLowerCase() : undefined,
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
    const { title, description, items } = req.body;
    if (!title || !items) return res.sendStatus(400);

    const user = req.user;
    if(!user) return res.sendStatus(500);

    try {
        const newWishlist = await prisma.wishlist.create({
            data: {
                ownerId: user.userId,
                title: title,
                description: description,
                items: {
                    create: items,
                },
            }
        });
        if (!newWishlist) return res.sendStatus(500);
        return res.status(201).json({message: "Wishlist created!"});
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const deleteWishlist = async (req: AuthorizationRequest, res: Response) => {
    const { wishlistId } = req.body;
    if (!wishlistId) return res.status(400).send("Missing id!");
    
    const user = req.user;
    if(!user) return res.sendStatus(500);

    try {
        const deletedWishlist = await prisma.wishlist.delete({
            where: {
                wishlistId: BigInt(wishlistId),
            },
        });
        const formattedData = stringifyComplexJSON(deletedWishlist);
        return res.status(200).json(JSON.parse(formattedData));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const searchForUsersByUsername = async (req: Request, res: Response) => {
    try {
        const {username} = req.body;
        if (!username) return res.status(400).send("Missing input!");

        const users = await prisma.user.findMany({
            where: {
                username: {
                    search: username,
                }
            },
            take: 5,
            select: {
                userId: true,
                username: true,
                firstName: true,
                lastName: true,
            }
        });
        return res.status(200).json(users);
    } catch {
        return res.sendStatus(500);
    }
}

export const getAllFriendships = async (req: AuthorizationRequest, res: Response) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    {initiatorId: user.userId},
                    {receiverId: user.userId},
                ]
            },
            include: {
                receiver: {
                    select: {
                        userId: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                initiator: {
                    select: {
                        userId: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    }
                },
            }
        });
        const formattedData = stringifyComplexJSON(friendships);
        return res.status(200).json(JSON.parse(formattedData));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const sendFriendRequest = async (req: AuthorizationRequest, res: Response) => {
    try {
        const {targetUserId} = req.body;
        const user = req.user;
        if (!user) throw new Error("No user connected to request!");
        if (user.userId === targetUserId) return res.sendStatus(400);

        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {initiatorId: user.userId, receiverId: targetUserId},
                    {initiatorId: targetUserId, receiverId: user.userId},
                ]
            }
        });
        if (existingFriendship !== null) return res.sendStatus(409);

        const newFriendship = await prisma.friendship.create({
            data: {
                initiatorId: user.userId,
                receiverId: targetUserId,
                confirmed: false,
            }
        });
        //Possible to send a notification to the receiving end here
        return res.status(201).json({message: "Sent friend request!"});
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

export const deleteFriendship = async (req: AuthorizationRequest, res: Response) => {
    try {
        const {friendshipId: targetFriendshipId}: {friendshipId?: string} = req.body;
        if (!targetFriendshipId) return res.status(400).send("Missing input!");

        const user = req.user;
        if (!user) throw new Error("No user connected to request!");

        const targetFriendship = await prisma.friendship.findUnique({
            where: {
                friendshipId: BigInt(targetFriendshipId),
            }
        });

        if (targetFriendship === null) return res.status(404).send("No friendship with that ID exists!");
        if (!(targetFriendship.initiatorId === user.userId || targetFriendship.receiverId === user.userId)) {
            return res.sendStatus(401);
        }

        const deletedFriendship = await prisma.friendship.delete({
            where: {
                friendshipId: BigInt(targetFriendshipId),
            }
        });

        if (deletedFriendship === null) throw new Error("Friendship was not deleted due to an unknown error!");
        return res.status(200).json({message: "Friendship deleted!"});
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}