import { Request, Response, NextFunction, Application } from "express";
import {authorizeToken, authenticateUser, refreshToken, getAuthToken, authorizeRefreshToken} from "../middleware/auth";
import {retrieveUserLists, getUserFromLoginInformation, registerUser, createWishlist, getFriends, getOwnProfile, logoutUser, searchForUsersByUsername, deleteWishlist, sendFriendRequest, getOutgoingFriendships, getIncomingFriendships} from "../middleware/dbManager";

export default (app: Application) => {

    let calls = 0;

    app.use("/api", (req: Request, res: Response, next: NextFunction) => {
        console.log(`Accessing API endpoint... (${(calls++) + 1})`);
        next();
    });

    app.post("/api/login", getUserFromLoginInformation, authenticateUser);
    app.post("/api/refreshtoken", getAuthToken, refreshToken);
    app.post("/api/register", registerUser, authenticateUser);
    app.post("/api/logout", getAuthToken, authorizeRefreshToken, logoutUser);
    app.post("/api/createlist", getAuthToken, authorizeToken, createWishlist);
    app.post("/api/deletewishlist", getAuthToken, authorizeToken, deleteWishlist);
    app.post("/api/sendfriendrequest", getAuthToken, authorizeToken, sendFriendRequest);
    app.post("/api/init", getAuthToken, authorizeToken, (req: Request, res: Response) => {
        return res.sendStatus(200);
    });
    app.post("/api/searchusers", searchForUsersByUsername);

    app.get("/api/mylists", getAuthToken, authorizeToken, retrieveUserLists);
    app.get("/api/friends", getAuthToken, authorizeToken, getFriends);
    app.get("/api/myprofile", getAuthToken, authorizeToken, getOwnProfile);
    app.get("/api/feed", (req: Request, res: Response) => {
        return res.sendStatus(404);
    });
    app.get("/api/outgoingfriendships", getAuthToken, authorizeToken, getOutgoingFriendships);
    app.get("/api/incomingfriendships", getAuthToken, authorizeToken, getIncomingFriendships);

    app.get("/api/", (req: Request, res: Response) => {
        console.log("Request received!");
        return res.sendStatus(200);
    });

}
