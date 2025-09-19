import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";


const authMiddleware = async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({
                message: "Unauthorized, no refresh token"
            })
        }

        const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as jwt.JwtPayload;

        const user = await User.findById(decodedToken.userId).select("-password");

        // console.log("Decoded Token:", decodedToken);
        // console.log("User fetched from DB:", user);

        if(!user){
            return res.status(401).json({
                message: "Unauthorized, no user found using this token"
            })
        }

        // console.log("User from auth middleware:", user);

        req.user = user;

        // console.log("Request after auth middleware:", req.user);

        next();

    } catch (error) {   
        console.error("Error in protectRoute middleware:", error);
        return res.status(401).json({
            message: "Unauthorized"
        })  
    }
}

export default authMiddleware;