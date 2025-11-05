import Order from "../model/Order.js";

// ✅ Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status)
      return res.status(400).json({ success: false, message: "Missing data" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Client cancel their order
export const clientCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "Order ID missing" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Only pending or processing orders can be cancelled
    if (["Completed", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Cannot cancel this order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};