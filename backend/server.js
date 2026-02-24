import express, { urlencoded } from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import cors from "cors";
const app = express();

const port = process.env.PORT || 8000;

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1/user", userRoute);
const serverConnect = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is run at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server ", error);
    process.exit(1);
  }
};
serverConnect();
 