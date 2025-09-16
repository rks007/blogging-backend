import express from "express"
import Blog from "../models/blog.model";

export const createController = async (req: any, res: express.Response) => {
    const {title, description} = req.body;
    try {
        const user = req.user;

        console.log("User in create blog controller:", user);
        
        if(!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        if(!title || !description){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const blog = await Blog.create({
            userId: user._id,
            title,
            description
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        })

    } catch (error) {
        console.error("Error in create blog controller", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const allBlogsConstroller = async (req: express.Request, res: express.Response) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({
            message: "All blogs fetched successfully",
            blogs
        })
    } catch (error) {
        console.error("Error in fetching all blogs", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const myBlogsController = async (req: any, res: express.Response) => {
    try {
        const user = req.user;

        if(!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const blogs = await Blog.find({
            userId: user._id
        })

        res.status(200).json({
            message: "User blogs fetched successfully",
            blogs
        })

    } catch (error) {
        console.error("Error in fetching user blogs", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const viewBlogController = async (req: any, res: express.Response) => {
    const {blogid} = req.params;
    try {

        if(!blogid){
            return res.status(400).json({
                message: "Blog id is required"
            })
        }

        const blog = await Blog.findById(blogid);

        if(!blog){
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        blog.counter += 1;
        await blog.save(); //save after incrementing the counter, kyu ki mongoose mein direct increment karne se save nahi hota

        res.status(200).json({
            message: "Blog fetched successfully",
            blog
        })
    } catch (error) {
        console.error("Error in fetching blog by id", error);   
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteBlogController = async (req:any, res: express.Response) => {
    const {blogid} = req.params;
    try {
        const user = req.user;
        if(!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        if(!blogid){
            return res.status(400).json({
                message: "Blog id is required"
            })
        }
        const blog = await Blog.findByIdAndDelete(blogid);

        res.status(200).json({
            message: "Blog deleted successfully",
            blog
        })
    } catch (error) {
        console.error("Error in deleting blog", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}