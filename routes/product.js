const express = require("express");
const router = express.Router();
const ProductSchema = require("../models/product_schema");
const CartSchema = require("../models/cart_schema");
const jwt = require("jsonwebtoken");
const upload = require("../config/image_upload");
require("dotenv").config();

// route to post a product with image upload--------------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const add_product = new ProductSchema({
      title: req.body.title,
      description: req.body.description,
      image: url + "/medias/" + req.file.filename,
      price: req.body.price,
      category_id: req.body.category_id,
      shopId: req.body.shopId
    });
    await add_product.save();
    res.status(200).json({
      message: "Product added successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: "error",
    });
  }
});

// code to get single product by id
router.get("/:id", async (req, res) => {
  try {
    const get_product = await ProductSchema.findById(req.params.id).lean();
    res.status(200).json(get_product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all podcucts by shop id
router.get("/shop/:shopid", async (req, res) => {
  const {shopid} = req.params;
  try {
    const allProducts = await ProductSchema.find({shopId: shopid});
    return res.json({message:"Shop products found",products: allProducts, status: "success" })
  } catch (error) {
    return res.json({message:"Shop products found", status: "success" })
  }
})
//Get all product_detail
router.get("/", async (req, res) => {
  try {
    const get_all_products = await ProductSchema.find().lean();
    res.status(200).json(get_all_products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Check if product is in cart or not
router.get("/cart/:id", async (req, res) => {
  const token =
    req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  if (token === undefined || token === null || token === "") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //CHeck if this user have this product in cart or not
  const cart = await CartSchema.findOne({
    user_id: decoded.id,
    product_id: req.params.id,
  });

  if (cart) {
    return res
      .status(400)
      .json({ message: "Product already in cart", is_in_cart: true });
  } else {
    return res
      .status(200)
      .json({ message: "Product not in cart", is_in_cart: false });
  }
});

//  code to update a product by id without image upload
router.put("/update/:id", async (req, res) => {
  try {
    const update_product = await ProductSchema.findById(req.params.id);
    if (!update_product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: "error" });
    }

    update_product.title = req.body.title;
    update_product.description = req.body.description;
    update_product.price = req.body.price;
    update_product.category_id = req.body.category_id;

    await update_product.save();
    res.status(200).json({
      message: "Product updated successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete One order_detail
router.delete("/:id", async (req, res) => {
  try {
    const delete_product = await product.findById(req.params.id);
    if (!delete_product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: "error" });
    }
    await delete_product.remove();
    res.status(200).json({
      message: "Product has been deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// route to delete a product with by id--------------

router.delete("/delete/:id", async (req, res) => {
  try {
    const delete_product = await ProductSchema.findById(req.params.id);
    if (!delete_product) {
      return res

        .status(404)
        .json({ message: "Product not found", status: "error" });
    }
    await delete_product.remove();
    res.status(200).json({
      message: "Product has been deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
