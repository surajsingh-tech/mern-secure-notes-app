import express from 'express';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRoute from './routes/user.route.js'
const app=express()

const port = process.env.PORT || 8000;


//middleware
app.use(express.json());
// app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I'm comming from backend",
    success: true,
  });
});

//middleware
app.use('/api/v1/user',userRoute)

const serverConnect= async()=>{
  try {
     await connectDB()
     app.listen(port,()=>{
          console.log(`Server is run at http://localhost:${port}`)  
      })  
  } catch (error) {
      console.error("Failed to start server ", error);
      process.exit(1);
  }
}
serverConnect() 