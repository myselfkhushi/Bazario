import User from "../models/user.model.js";
import genratetoken from "../utils/generateToken.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";

export const registerUser =asynchandler( async (req,res) =>{
    
    const {name,email,password} = req.body;
      

    if(!name || !email || !password){
        throw new ApiError("All field are required",400);
    }

    const existinguser =  await User.findOne({email})

    if(existinguser){
       throw new ApiError("User already registered",400);
    }

    const user =  await User.create({
        name,password,email
    })
     
    const token =genratetoken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
        });
       res.status(200).json({
        success:true,
        message:"user successfully registered",
        user,
    });
});


 export const loginUser =asynchandler(async (req,res) => {
    
    const {email,password} = req.body;
        
    if(!email || !password){
       throw new ApiError("All field are required",400);
    }

    const user= await User.findOne({email}).select("+password");
       
    console.log(user);

    if(!user){
       throw new ApiError("Invalid email or password",400);
    }

    const ispasswordmatched= await user.comparePassword(password);
    
    if(!ispasswordmatched){
        throw new ApiError("Invalid email or password",400);
    }
    const token =genratetoken(user._id);

    user.password=undefined; 
    
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
    });
     res.status(200).json({
        success:true,
        message:"user login successfully",
        token,
        user,
    });

});


    export const getProfile =asynchandler( async(req,res)=>{
        
            res.status(200).json({
                success:true,
                user:req.user,
            });
        
    });

    export const logoutUser = asynchandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

    export const adminDashboared =asynchandler(async (req,res)=>{
      
            res.status(200).json({
                success:true,
                message:"Welcome admin",
        
    });
    });

