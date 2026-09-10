import jwt  from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticate = async(req,res,next)=>{
    try{

        if(!req.cookies.token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized",
            });
        }

       const token = req.cookies.token;

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
      return res.status(400).json({
        success:false,
        message:error.message,
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