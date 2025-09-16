import express from "express";
import { loginController, logoutController, signupController } from "../controllers/user.controller";

const userrouter = express.Router();


userrouter.post("/signup", signupController)
userrouter.post("/logout", logoutController)
userrouter.post("/login", loginController)



export default userrouter;