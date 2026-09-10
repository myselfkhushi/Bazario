export const validatelogin = async(req,res,next)=>{
   const {email,password}=req.body;

   if(!email || !password){
    return res.status(400).json({
        success:true,
        message:"email and password required"
    })
   }

   next();
}