import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
  paymentMethod: { type: String, default: "Cash on Delivery" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
