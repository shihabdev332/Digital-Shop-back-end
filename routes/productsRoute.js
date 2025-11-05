import express from "express";
import {
  addProduct,
  removeProduct,
  listProducts,
  singleProduct,
  searchProducts,
} from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRoute = express.Router();

productRoute.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  adminAuth,
  addProduct
);
productRoute.post("/remove", removeProduct);
productRoute.get("/list", listProducts);
productRoute.get("/single", singleProduct);
productRoute.get("/search", searchProducts);

export default productRoute;
