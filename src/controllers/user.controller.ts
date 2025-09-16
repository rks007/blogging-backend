import express from "express"
import User from "../models/user.model";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"



//generate jwt to store in cookies

const generateToken = async (userId: any) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET as string, {
        expiresIn: "2d"
    })

    return token;
}

const setCookies = (res: any, refreshToken: any) => {
    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent CSRF attacks
        maxAge: 2 * 24 * 60 * 60 * 1000 //7 days
    })
}

export const signupController = async (req: express.Request, res:express.Response) => {
    const {username, email, password} = req.body;

    try {
        
        if(!username || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existingEmail = await User.findOne({
            email: email
        })

        if(existingEmail){
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        const refreshToken = await generateToken(user._id);

        setCookies(res, refreshToken);

        res.status(201).json({
            message: "User created successfully",
            user
        })


    } catch (error) {
        console.error("Error in signup controller", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const loginController = async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body;

    try {
        //all fields chahiye
        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //user exists karta hai ki nahi
        const user = await User.findOne({
            email: email
        })

        if(!user){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        //password match karwao
        const isPasswordMatched = await bcryptjs.compare(password, user.password);

        if(!isPasswordMatched){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const refreshToken = await generateToken(user._id);

        setCookies(res, refreshToken);

        res.status(200).json({
            message: "Login successful",
            user
        })

    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const logoutController = async (req: express.Request, res: express.Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(400).json({
                message: "No refresh token found"
            })
        }
        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.error("Error in logout controller", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}