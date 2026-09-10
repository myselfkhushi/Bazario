export const validateregister=async(req,res,next)=>{
   const {name,email,password}=req.body;

   if(!name || !email || !password){
    return res.status(400).json({
        suceess:false,
        message:"all field is required"
    })
   }

   if(password.length<4){
    return res.status(400).json({
        sucess:false,
        message:"password must be 4 letters"
    })
   }

   next();
}