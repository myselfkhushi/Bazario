
import cloudinary from "../config/cloudinary.js";

const uploadtocloudinary=async (filebuffer)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream(
            {
                folder:"ecommerce-product",
            },
            (error,result)=>{
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            }
        )
        .end(filebuffer)
    });
}

export default uploadtocloudinary;