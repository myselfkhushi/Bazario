import jwt  from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticate = async(req,res,next)=>{
    try{
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization;
            }
        }

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized",
            });
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
             return res.status(403).json({
                success:false,
                message:"User not found",
            })
        }

        req.user=user;
        next();
    }catch(error){
      return res.status(401).json({
        success:false,
        message: "Invalid or expired token",
       });
    }
}

export const authorizeRole =(...roles)=>{
    return (req,res,next)=>{
        console.log("authorirole hit");
            if(!roles.includes(req.user.role)){
                return res.status(403).json({
                    success:false,
                    message:"Acess denied"
                })
            }
            next();
            
    }
}