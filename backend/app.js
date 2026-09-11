// dotenv
import dotenv from "dotenv";
dotenv.config();


// path
import path from "path";
import { fileURLToPath } from "url";
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// express
import express from "express";
const app = express();

// cloudinary
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middleware
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// razorpay
import Razorpay from "razorpay";
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// mongoose
import mongoose from "mongoose";
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`DB connected successfully `);
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// routes
import productRoutes from "./routers/productRoutes.js";
import userRoutes from "./routers/userRoutes.js";
import orderRoutes from "./routers/orderRoutes.js";
import paymentRoutes from "./routers/paymentRoutes.js";

app.use("/api", productRoutes);
app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

// -------------------------------
// Serve frontend in production
// -------------------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname,"../frontend/project/dist");
  app.use(express.static(frontendPath));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Error Handler
import ExpressError from "./utils/ExpressError.js";
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    err = new ExpressError("Invalid ID Format", 404);
  }
  const {statusCode = 500,message = "Something went wrong",} = err;
  res.status(statusCode).send(message);
});

// port
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});