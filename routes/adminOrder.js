import express from "express";
import Order from "../model/orderModel.js";
import { getAllOrders, updateOrderStatus } from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import { verifyToken } from "../middleware/verifyToken.js"; // user authentication middleware

const router = express.Router();



// Create new order
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(200).json({ success: true, message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all orders for a specific user
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/", adminAuth, getAllOrders);

// Admin: update order status
router.put("/", adminAuth, updateOrderStatus);

export default router;
