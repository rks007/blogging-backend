import express from "express";
import { allBlogsConstroller, createController, deleteBlogController, myBlogsController, viewBlogController } from "../controllers/blog.controller";
import authMiddleware from "../middlewares/auth.middleware";

const blogrouter = express.Router();

blogrouter.post("/create", authMiddleware, createController);
blogrouter.get("/", allBlogsConstroller);
blogrouter.get("/myblogs", authMiddleware, myBlogsController);
blogrouter.get("/:blogid", authMiddleware, viewBlogController);
blogrouter.delete("/:blogid", authMiddleware, deleteBlogController);

export default blogrouter;