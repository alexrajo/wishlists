import express from "express";
import { Prisma } from "@prisma/client";

const { PrismaClient } = require("@prisma/client");
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();
const app = express();

const addWishlist = async () => {};

const addUser = async (user: Prisma.usersCreateInput) => {
  const newUser = await prisma.users.create({
    data: user,
  });
};

app.get("/", (req, res) => {
  console.log("Request received!");
  res.send("Hello!");
});

app.post("/add_user", (req, res) => {
  const newUser = {
    username: "bobbysox",
    password: "abc123",
    first_name: "Bobby",
    last_name: "Shmurda",
    date_of_birth: "1994-08-04",
    email: "bobbyman123@gmail.com",
  };
  res.json(addUser(newUser));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
