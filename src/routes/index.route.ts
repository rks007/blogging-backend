import express from "express";
import userrouter from "./user.route";
import blogrouter from "./blog.route";

const router = express.Router();

router.use("/user", userrouter);

router.use("/blog", blogrouter)


export default router;