import { v2 as cloudinary } from "cloudinary";
import productModel from "../model/productModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      _type,
      name,
      category,
      price,
      discountedPercentage,
      brand,
      badge,
      isAvailable,
      offer,
      description,
      tags,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];

    if (!name) {
      return res.send({ success: false, message: "product name is required" });
    }

    if (!price) {
      return res.send({ success: false, message: "product price is required" });
    }

    if (!description) {
      return res.send({
        success: false,
        message: "product description is required",
      });
    }

    let images = [image1, image2, image3].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let parsedTags;
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    }

  const productData = {
  _type: _type ? _type : "",
  name,
  price: Number(price),
  discountedPercentage: Number(discountedPercentage),
  category: category ? category : "",
  brand: brand ? brand : "",
  badge: badge,         
  isAvailable: isAvailable, 
  offer: offer,        
  description,
  tags: tags ? parsedTags : [],
  images: imagesUrl,
};

    const product = new productModel(productData);
    product.save();
    res.send({
      success: true,
      message: `${name} Added and saved to db successfully`,
    });
  } catch (error) {
    console.log("error", error);
    return res.json({ success: false, message: error.message });
  }
};

// removeProduct
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "Product removed Successfully" });
  } catch (error) {
    console.log("error", error);
    return res.json({ success: false, message: error.message });
  }
};

//list Product
const listProducts = async (req, res) => {
  try {
    const total = await productModel.countDocuments({});
    const product = await productModel.find({});
    if (product.length) {
      res.send({ success: true, total, product });
    } else {
      return res.json({
        success: false,
        message: "No Products Found!",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.json({ success: false, message: error.message });
  }
};

// search Products
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const filter = {};
    if (query) {
      filter.name = { $regex: query, $options: "i" }; 
    }
    const product = await productModel.find(filter).limit(50); 
    res.json({ success: true, product });
  } catch (error) {
    console.log("error", error);
    return res.json({ success: false, message: error.message });
  }
};

//single Product
const singleProduct = async (req, res) => {
  try {
    const { _id } = req.query;
    const product = await productModel.findById(_id);
    res.json({ success: true, product });
  } catch (error) {
    console.log("error", error);
    return res.json({ success: false, message: error.message });
  }
};

export { addProduct, removeProduct, listProducts, singleProduct, searchProducts };
 