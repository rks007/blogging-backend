import express from "express";
import { allBlogsConstroller, createController, deleteBlogController, myBlogsController, paginationBlogController, updateBlogController, viewBlogController } from "../controllers/blog.controller";
import authMiddleware from "../middlewares/auth.middleware";

const blogrouter = express.Router();

blogrouter.post("/create", authMiddleware, createController);
blogrouter.get("/", allBlogsConstroller);
blogrouter.get("/page", paginationBlogController);
blogrouter.get("/myblogs", authMiddleware, myBlogsController);
blogrouter.get("/:blogid", authMiddleware, viewBlogController);
blogrouter.put("/:blogid", authMiddleware, updateBlogController)
blogrouter.delete("/:blogid", authMiddleware, deleteBlogController);

export default blogrouter;