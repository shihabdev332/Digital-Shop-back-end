import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _type: { type: String },
  name: { type: String, required: true },
  category: { type: String},
  images: { type: Array, required: true },
  price: { type: Number, required: true },
  discountedPercentage: { type: Number },
  
  brand: { type: String },
  badge: { type: Boolean },
  isAvailable: { type: Boolean },
  offer: { type: Boolean },
  description: { type: String, required: true },
  tags: { type: Array },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
