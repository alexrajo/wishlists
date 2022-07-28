import { Response, NextFunction } from "express";
import { UserIdBasedConditionalRequest } from "../config/types";

export const getUserIdFromAuthorizedUser = (req: UserIdBasedConditionalRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    req.targetUserId = user.userId;
    next();
}