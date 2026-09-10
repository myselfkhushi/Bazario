import Product from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
// import {cloudinary} from "../config/cloudinary.js"
import uploadtocloudinary from "../utils/uploadtocloudinary.js";

export const createProduct =asynchandler( async (req,res)=>{
        
        const {title,description,price,stock,category}=req.body;

        if(!req.files || req.files.length === 0){
            throw new ApiError("image is required",404);
        }
        const images=[];
        for (const file of req.files){
            const uploadImage=await uploadtocloudinary(file.buffer);

            images.push({
                public_id:uploadImage.public_id,
                url:uploadImage.secure_url,
            })
        }

        const Products = await Product.create({
            title,description,price,stock,category,images,createdBy:req.user._id,
        })
        
        res.status(200).json({
            success:true,
            message:"Product created successfully",
            product:Products,
        })
    
    
});

export const getallproducts =asynchandler( async (req,res)=>{

    const products=await Product.find().populate(
        "createdBy",
        "name email",
        
    );

    res.status(200).json({
        success:true,
        count:products.length,
        product:products,
    });

})

export const getsingleproduct = asynchandler( async (req,res)=>{
    
        const products=await Product.findById(req.params.id).populate(
            "createdBy",
            "name email"
        )

        if(!products){
            throw new ApiError("product not found",404);
        }

        res.status(200).json({
            success:true,
            message:"product found successfully",
            product:products,
        });

    
});

export const updateproduct =asynchandler( async (req,res)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        throw new ApiError("product not found",404);
    }

    if (product.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized user",403);
    }

    // if(req.file){
    //     const uploadimage= await uploadtocloudinary(
    //         req.file.buffer
    //     )
    //     req.body.image=uploadimage.secure_url;
    // }
    
    const updateProduct=await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true,
            runValidators:true
        }
    );


    res.status(200).json({
        success:true,
        message:"product update successfully",
        updateProduct,
    })
        
});

export const deleteproduct=asynchandler( async (req,res)=>{
    
        const product=await Product.findById(req.params.id);

        if(!product){
           throw new ApiError("product not found",404);
        }

        if (product.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized user",403);
}
        await product.deleteOne();
       cloudinary.uploader.destroy(product.imagepublicid);

        res.status(200).json({
            success:true,
            message:"product deleted"
        })
})

export const getproductwithsearch =asynchandler( async (req,res)=>{
   
        const keyword=req.query.keyword || "";
      
        const product =await Product.find({
            title:{
                $regex:keyword,
                $options:"i",
            },
        })

        res.status(200).json({
            success:true,
            count:product.length,
            product
        })
    
       
})

export const getproductwithpagination= asynchandler(async(req,res)=>{
        const page=Number(req.query.page) || 1;
        const limit=2;
        const skip=(page-1)*limit;

        const product =await Product.find().skip(skip).limit(limit);
        const totalproducts= await Product.countDocuments();

        res.status(200).json({
            success:true,
            currentpage:page,
            totalpage:Math.ceil(totalproducts/limit),
            totalproducts,
            product,
        })

    
})

export const getproductwithcategory=asynchandler(async(req,res)=>{
    
        const product=await Product.find({

            category:req.params.category
        })

        res.status(200).json({
            success:true,
            count:product.length,
            product,
        })
   
})

export const getmyproduct= asynchandler( async(req,res)=>{
   
        const products =await Product.find({
            createdBy:req.user._id,
        })

        console.log(req.user);

        res.status(200).json({
            success:true,
            count:products.length,
            product:products,
        })
   
})

export const getproductcount =asynchandler( async(req,res)=>{
  
    const count =await Product.countDocuments();

    res.status(200).json({
        success:true,
        count,
    })
  
  
});