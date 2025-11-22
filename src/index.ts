import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./route/userRoutes.js";
import taskRoute from "./route/taskRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

//INITIALIZE
const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//CONNECTING TO DATA BASE
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅Connected to MongoDb");
  })
  .catch((err: any) => {
    console.log("MongoDb connection error", err);
  });

//USER ROUTE
app.use("/api/users", userRoute);
app.use("/api/tasks", taskRoute);

app.get("/", healthstatus);

function healthstatus(req: any, res: any) {
  return res.json({ message: "health status working fine" });
}

//CONNECTING TO SERVER
app.listen(port, () => {
  console.log(`Server is connected to port ${port}`);
});
