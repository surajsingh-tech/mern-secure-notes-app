import mongoose from "mongoose";

const connectDB = async ()=>{
  try {

    await mongoose.connect(`${process.env.MONGO_URI}/notes_auth_app`)

      console.log('DB connected successfully');
      
  } catch (error) {
    console.log('Connection error',error);
  }
}

export default connectDB;