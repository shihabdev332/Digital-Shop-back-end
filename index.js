// index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Configs
import dbConnect from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import userRouter from "./routes/userRouters.js";
import productRoute from "./routes/productsRoute.js";
import orderRoute from "./routes/adminOrder.js"; // Make sure this file exists

const app = express();

// Log JWT secret for debugging
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Middlewares
app.use(cors());
app.use(express.json());

// Database & Cloudinary
dbConnect();
connectCloudinary();

// Test routes
app.get("/", (req, res) => {
  res.send("Hello from Digital shop API server");
});

app.get("/api", (req, res) => {
  res.send("Hello, this is Digital Shop API");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute); // Admin order routes

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
