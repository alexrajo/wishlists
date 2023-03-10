import { Request, Response, NextFunction, Application } from "express";
import {
  authorizeToken,
  authenticateUser,
  refreshToken,
  getAuthToken,
  authorizeRefreshToken,
} from "../middleware/auth";
import {
  getUserFromLoginInformation,
  registerUser,
  createWishlist,
  getOwnProfile,
  logoutUser,
  searchForUsersByUsername,
  deleteWishlist,
  sendFriendRequest,
  getAllFriendships,
  deleteFriendship,
  confirmFriendship,
  retrieveWishlistsByUserId,
  getFeed,
} from "../middleware/dbManagement";
import { getUserIdFromAuthorizedUser } from "../middleware/misc";
import { changePassword } from "../middleware/settingsManagement";

export default (app: Application) => {
  let calls = 1;

  app.use("/api", (req: Request, res: Response, next: NextFunction) => {
    console.log(`Accessing API endpoint... (${calls++})`);
    next();
  });

  app.post("/api/login", getUserFromLoginInformation, authenticateUser);
  app.post("/api/refreshtoken", getAuthToken, refreshToken);
  app.post("/api/register", registerUser, authenticateUser);
  app.post("/api/logout", getAuthToken, authorizeRefreshToken, logoutUser);
  app.post("/api/createlist", getAuthToken, authorizeToken, createWishlist);
  app.post("/api/deletewishlist", getAuthToken, authorizeToken, deleteWishlist);
  app.post("/api/sendfriendrequest", getAuthToken, authorizeToken, sendFriendRequest);
  app.post("/api/deletefriendship", getAuthToken, authorizeToken, deleteFriendship);
  app.post("/api/acceptfriendship", getAuthToken, authorizeToken, confirmFriendship);
  app.post("/api/searchusers", searchForUsersByUsername);
  app.post("/api/init", getAuthToken, authorizeToken, (res: Response) => res.sendStatus(200));
  app.post("/api/changepassword", getAuthToken, authorizeToken, changePassword);

  app.get("/api/mylists", getAuthToken, authorizeToken, getUserIdFromAuthorizedUser, retrieveWishlistsByUserId);
  app.get("/api/myprofile", getAuthToken, authorizeToken, getOwnProfile);
  app.get("/api/getuserwishlists/:targetUserId", getAuthToken, authorizeToken, retrieveWishlistsByUserId);
  app.get("/api/feed", getAuthToken, authorizeToken, getFeed);
  app.get("/api/friendships", getAuthToken, authorizeToken, getAllFriendships);

  app.get("/api/", (req: Request, res: Response) => {
    console.log("Request received!");
    return res.sendStatus(200);
  });
};
