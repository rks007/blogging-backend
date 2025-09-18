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

export const updateBlogController = async (req: any, res: express.Response) => {
    const {blogid} = req.params;
    const {title, description} = req.body;

    try {

        if(title === "" || description === ""){
            return res.status(400).json({
                message: "Title or description cannot be empty"
            })
        }
        if(!blogid){
            return res.status(400).json({
                message: "Blog id is required"
            })
        }

        const blog = await Blog.findByIdAndUpdate(
            blogid,
            {
            title,
            description
        },{new: true}); //new:true ka matlab hai updated blog return hoga, otherwise vo purana blog return karta hai


        res.status(200).json({
            message: "Blog updated successfully",
            blog
        })
    } catch (error) {
        console.error("Error in updating blog", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const paginationBlogController = async (req: express.Request, res: express.Response) => {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 20;

    const skip = (page - 1) * limit; //formula

    try {
        
        const blogs = await Blog.find().skip(skip).limit(limit).sort({createdAt: -1}); //sort used for latest blogs first

        const totalBlogs = await Blog.countDocuments();
        const totalpages = Math.ceil(totalBlogs / limit);

        res.status(200).json({
            message: "Blogs fetched successfully",
            blogs,
            page,
            totalpages,
            totalBlogs,
            hasNextPage: page < totalpages,
            hasPrevPage: page > 1
        })

    } catch (error) {
        console.error("Error in pagination blog controller", error);
        res.status(500).json({
            message: "Internal server error"
        })      
    }
}