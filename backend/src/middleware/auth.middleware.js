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

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // 🛑 Strict Verification Gate: Block unverified sellers from seller operations
        if (req.user.role === "seller" && !req.user?.sellerDetails?.isSellerVerified) {
            return res.status(403).json({
                success: false,
                message: "Seller verification incomplete. Please complete all onboarding verification steps before accessing seller operations."
            });
        }

        next();
    };
};

export const isVerifiedSeller = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    if (req.user.role === "admin") {
        return next();
    }

    if (req.user.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Seller account required."
        });
    }

    if (!req.user.sellerDetails?.isSellerVerified) {
        return res.status(403).json({
            success: false,
            message: "Seller verification incomplete. Please complete all onboarding verification steps before accessing seller operations."
        });
    }

    next();
};