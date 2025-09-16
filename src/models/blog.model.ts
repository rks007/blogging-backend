import mongoose from "mongoose";    

const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true  
    },
    description: {
        type: String,
        required: true
    },
    counter: {
        type: Number,
        default: 1
    }
}, {timestamps: true})

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;