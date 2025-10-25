import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

//PORT erzeugen
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//public routes aus authRoute.js
app.use("/api/auth", authRoute);

//private routes
app.use("/api/user", protectedRoute, userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`===server is running on Port ${PORT}===`);
  });
});
