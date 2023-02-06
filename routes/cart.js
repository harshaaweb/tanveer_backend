const express = require("express");
const router = express.Router();
const CartSchema = require("../models/cart_schema");
const ProductSchema = require("../models/product_schema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//post a category
router.post("/", async (req, res) => {
  //Check user have token or not
  const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  if (token === undefined || token === null || token === "") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //CHeck if this user have this product in cart or not
  const cart = await CartSchema.findOne({
    user_id: decoded.id,
    product_id: req.body.product_id,
  });

  if (cart) {
    return res.status(400).json({ message: "Product already in cart" });
  }

  try {
    const cart = new CartSchema({
      user_id: decoded.id,
      product_id: req.body.product_id,
      quantity: req.body.quantity
    });
    await cart.save();
    res.status(201).json({ message: "Cart created successfully", status: "success" });
  }
  catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Get my cart
router.get("/my", async (req, res) => {
  try {
    const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

    if (token === undefined || token === null || token === "") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const cart = await CartSchema.find({ user_id: decoded.id });

    //Map cart to get product details
    const cartWithProductDetails = await Promise.all(cart.map(async (cartItem) => {
      const product = await ProductSchema.findById(cartItem.product_id);
      return {
        ...cartItem._doc,
        product
      }
    }));

    res.status(200).json(cartWithProductDetails);
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Get one order_detail
router.get("/:id", async (req, res) => {
  try {
    const cart = await CartSchema.findById(req.params.id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Delete all order_detail
router.delete("/clear-all", async (req, res) => {
  try {
    const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

    if (token === undefined || token === null || token === "") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const carts = await CartSchema.find({user_id: decoded.id });
    for( let i = 0; i < carts.length; i++){
      await CartSchema.findByIdAndDelete(carts[i]._id);
    }
    res.status(200).json({ message: "Cart deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});


//Delete One order_detail
router.delete("/:id", async (req, res) => {
  try {
    await CartSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cart deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Update quantity of cart
router.patch("/update-quantity/:id", async (req, res) => {
  try {
    await CartSchema.findByIdAndUpdate(req.params.id, { quantity: req.body.quantity });
    res.status(200).json({ message: "Cart updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error"});
  }
});

module.exports = router