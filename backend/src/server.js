import app from "./app.js";
import connectDB from "./database/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;


const startserver = async ()=>{
    try{
        await connectDB();
       app.listen(PORT,() =>{
       console.log(`server is listening on port ${PORT}`);
    });
    }catch(error){
        console.log("server error",error.message);
    }

   }

startserver();

