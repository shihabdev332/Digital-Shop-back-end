import express from "express";
import { getAllOrders, updateOrderStatus, clientCancelOrder, getUserOrders } from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js"; // normal user token verify

const orderRoute = express.Router();

// GET all orders (admin)
orderRoute.get("/", adminAuth, getAllOrders);

// GET orders of a user (client)
orderRoute.get("/user/:userId", authMiddleware, getUserOrders);

// UPDATE order status (admin)
orderRoute.put("/", adminAuth, updateOrderStatus);

// CLIENT cancel order
orderRoute.put("/cancel", authMiddleware, clientCancelOrder);

export default orderRoute;
