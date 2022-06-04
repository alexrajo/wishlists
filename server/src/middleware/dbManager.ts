import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
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
        return res.status(200).json(lists);
    } catch (e) {
        return res.sendStatus(500);
    }
}

export const registerUser = async (req: Request, res: Response) => {
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

        res.status(200).send("User account created!");
    } catch(e) {
        console.error(e);
        return res.sendStatus(500);
    }
}