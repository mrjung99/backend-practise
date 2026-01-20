import express from "express";
import { signup } from "../controllers/auth.controller.js";

export const authRoute = express.Router();

authRoute.route("/signup").post(signup);
