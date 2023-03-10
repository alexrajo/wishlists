import { Response } from "express";
import { AuthorizationRequest } from "../config/types";
import { hashPassword, passwordIsCorrect } from "../utils/authUtils";
import { getUserFromSignedData, updateUserData } from "./dbManagement";

export const changePassword = async (req: AuthorizationRequest, res: Response) => {
  const { user: limitedUserData } = req;
  if (limitedUserData === undefined || limitedUserData === null)
    return res.status(400).send("Found no user when request was received!");

  const user = await getUserFromSignedData(limitedUserData);
  if (user === null) return res.status(404).send("Found no user in database with given information!");

  const { oldPassword, newPassword } = req.body;
  if (!(await passwordIsCorrect(user.password, oldPassword)))
    return res.status(401).send("Old password given is incorrect!");

  // Set newPassword as new password for user
  const hashedPassword = await hashPassword(newPassword);
  const success = await updateUserData(limitedUserData.userId, { password: hashedPassword });
  if (success) return res.sendStatus(204);
  return res.status(500).send("Internal server error when trying to update password for user!");
};
