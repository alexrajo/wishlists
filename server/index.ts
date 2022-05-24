import express from "express";
import { Prisma, User } from "@prisma/client";
import e from "express";
import { env } from "process";

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const saltRounds = 10;
const illegalUsernameFormat = /[!-\/:-@[-`{-~ ]/;

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "645hfgj-&RYUfhgh8w3r",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, //Needs to be changed once https has been put in place
    },
  })
);

const addWishlist = async () => {};

const addUser = async (user: Prisma.UserCreateInput) => {
  const newUser = await prisma.user.create({
    data: user,
  });
  return newUser;
};

const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

app.get("/api", (req, res) => {
  console.log("Request received! DB ULR: " + process.env.DATABASE_URL);

  const session = req.session;
  if (session) {
    res.json({
      message: session.loggedin ? "Hello, " + session.username + "!" : "Hello!",
      loggedin: session.loggedin,
    });
  } else {
    res.status(500).json("An error occurred: Could not load session data.");
  }
});

app.get("/api/users", (req, res) => {
  console.log("GETTING USERS, DB_URL: " + process.env.DATABASE_URL);
  getUsers()
    .then((users) => {
      res.json(users);
    })
    .catch((e) => {
      console.error(e.message);
      res
        .status(500)
        .json("An error occurred while getting users from database!");
    });
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, password, firstName, lastName, dateOfBirth, email } =
      req.body;

    if (
      !(username && password && firstName && lastName && dateOfBirth && email)
    ) {
      res.status(400);
      throw new Error("Missing input!");
    }

    if (username.length < 1) {
      res.status(400);
      throw new Error("Please enter a username!");
    }

    if (password.length < 8) {
      res.status(400);
      throw new Error("Password needs to be at least 8 characters long!");
    }

    if (illegalUsernameFormat.test(username)) {
      res.status(400);
      throw new Error(
        "Only letters a-z, A-Z and numbers are allowed in a username!"
      );
    }

    let encryptedPassword;
    try {
      encryptedPassword = await bcrypt.hash(password, saltRounds);
    } catch {
      res.status(500);
      throw new Error("An error occurred while hashing information!");
    }

    if (await prisma.user.findFirst({ where: { username: username } })) {
      res.status(409);
      throw new Error("Username already in use!");
    }

    if (await prisma.user.findFirst({ where: { email: email } })) {
      res.status(409);
      throw new Error(
        "An account with that email already exists. Please log in instead."
      );
    }

    const newUser = {
      username: username,
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: new Date(dateOfBirth),
      email: email,
    };

    if (!addUser(newUser)) {
      res.status(500);
      throw new Error("Could not add user!");
    }
    res.status(200).json({
      authToken: "test",
      message: "User account created!",
    });
  } catch (e: any) {
    let message =
      "Could not register due to an unknown internal server error. Please try again later.";
    if (e instanceof Error) message = e.message;
    res.json(message);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const session = req.session;

    if ((!email && !username) || !password) {
      res.status(400).json("Input missing!");
    }

    let targetUser: User | undefined;
    if (email) {
      targetUser = await prisma.user.findFirst({ where: { email: email } });
    } else if (username) {
      targetUser = await prisma.user.findFirst({
        where: { username: username },
      });
    }

    if (targetUser) {
      await bcrypt.compare(
        password,
        targetUser!.password,
        (_err: any, approved: boolean) => {
          if (approved) {
            if (session) {
              session.userId = targetUser!.userId;
              session.username = targetUser!.username;
              session.loggedin = true; //NEEDS TO BE LOOKED INTO, IS THIS SECURE?? MAYBE USE SessionId?
            }
            res.status(200).json({
              message: `Login successful! Welcome, ${targetUser?.firstName}.`,
              loggedin: true,
            });
          } else {
            res
              .status(401)
              .json(
                "Login failed. Please check that your login information is correct."
              );
          }
        }
      );
    } else {
      res.status(401).json("Login failed. User not found!");
    }
  } catch {
    console.log("An error occurred while trying to log in!");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
