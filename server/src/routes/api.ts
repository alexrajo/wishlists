import { Request, Response, NextFunction, Application } from "express";
import { AuthorizationRequest } from "../config/types";
import {authorizeToken, authenticateUser, refreshToken} from "../middleware/auth";
import {retrieveUserLists, getUserFromLoginInformation, registerUser} from "../middleware/dbManager";

export default (app: Application) => {

    app.use("/api", (req: Request, res: Response, next: NextFunction) => {
        console.log("Accessing API endpoint...");
        next();
    });

    app.post("/api/login", getUserFromLoginInformation, authenticateUser);
    app.post("/api/refreshtoken", refreshToken);
    app.post("/api/register", registerUser);
    app.post("/api/createlist", authorizeToken, (req: AuthorizationRequest, res: Response, next: NextFunction) => {
        const { title, description, content } = req.body;
        if (!title) res.sendStatus(400);
        res.sendStatus(404);
    });

    app.get("/api/mylists", authorizeToken, retrieveUserLists);

    app.get("/api/", (req: Request, res: Response) => {
        console.log("Request received!");
        res.sendStatus(200);
    });

}
