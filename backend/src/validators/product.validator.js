// import Product from "../models/product.model.js";

export const validateproduct=async (req,res,next)=>{
    
    const {title,description,price,stock,category}=req.body;

    if(!title || !description || !price || !stock || !category){
        return res.status(400).json({
            success:false,
            message:"all field is required"
        })

    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one image is required"
        });
    }

    if(price<=0){
       return res.status(400).json({
            success:false,
            message:"price should be greter than 0"
        })
    }
    if(stock<0){
       return  res.status(400).json({
            success:false,
            message:"stock can not be negative"
        })
    }

    next();
}
