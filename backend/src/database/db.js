import mongoose from "mongoose";


const connectDB = async () =>{
    try{
       const conn = await mongoose.connect(process.env.MONGO_URL);
       console.log(`database connected successfully${conn.connection.host}`);
    }
    catch(error){
       console.log(`database not connected ${error.message}`);
       process.exit(1);
    }
};

export default connectDB;