import express from "express";
import { signIn, signup } from "../controllers/auth.controller.js";

export const authRoute = express.Router();

authRoute.route("/signup").post(signup);
authRoute.route("/signin").post(signIn);
