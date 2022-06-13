import { Request, Response, NextFunction, Application } from "express";
import { AuthorizationRequest } from "../config/types";
import {authorizeToken, authenticateUser, refreshToken, getAuthToken} from "../middleware/auth";
import {retrieveUserLists, getUserFromLoginInformation, registerUser, createWishlist, getFriends, getOwnProfile} from "../middleware/dbManager";

export default (app: Application) => {

    app.use("/api", (req: Request, res: Response, next: NextFunction) => {
        console.log("Accessing API endpoint...");
        next();
    });

    app.post("/api/login", getUserFromLoginInformation, authenticateUser);
    app.post("/api/refreshtoken", getAuthToken, refreshToken);
    app.post("/api/register", registerUser, authenticateUser);
    app.post("/api/createlist", getAuthToken, authorizeToken, createWishlist);
    app.post("/api/init", getAuthToken, authorizeToken, (req: Request, res: Response) => {
        return res.sendStatus(200);
    });

    app.get("/api/mylists", getAuthToken, authorizeToken, retrieveUserLists);
    app.get("/api/friends", getAuthToken, authorizeToken, getFriends);
    app.get("/api/myprofile", getAuthToken, authorizeToken, getOwnProfile);
    app.get("/api/feed", (req: Request, res: Response) => {
        return res.sendStatus(404);
    });

    app.get("/api/", (req: Request, res: Response) => {
        console.log("Request received!");
        return res.sendStatus(200);
    });

}
