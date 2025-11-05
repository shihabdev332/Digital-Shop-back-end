import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
