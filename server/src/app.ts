import { Request, Response } from "express";
import api from "./routes/api";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

api(app);
app.get("/", (req: Request, res: Response) => res.status(404).send("There is nothing to show here"));

app.listen(PORT, console.log(`Server listening on port ${PORT}`));