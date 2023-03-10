import { User } from "@prisma/client";
import { SignedUserData } from "../config/types";
import { getUserFromUserId } from "../middleware/dbManagement";

const bcrypt = require("bcrypt");
const saltRounds = 10;

export const passwordIsCorrect = async (hashedRealPassword: string, givenPassword: string) => {
  return await bcrypt.compare(givenPassword, hashedRealPassword);
};

export const hashPassword = async (plainTextPassword: string): Promise<string> =>
  bcrypt.hash(plainTextPassword, saltRounds);

export const isValidPassword = (password: string) => {
  return password.length >= 8;
};
