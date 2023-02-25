const express = require("express");
const router = express.Router();
const CartSchema = require("../models/cart_schema");
const ProductSchema = require("../models/product_schema");
const jwt = require("jsonwebtoken");
const { getAuthUser } = require("../config/authuser");
require("dotenv").config();

//post a category
router.post("/", getAuthUser, async (req, res) => {
  try {
    const user = req.user;
    const { product_id } = req.body;

    //CHeck if this user have this product in cart or not
    const cart = await CartSchema.findOne({
      user_id: user._id,
      product_id: product_id,
    }).populate([
      {
        path: "product_id",
        select: "seller_id",
      }
    ])

    if (cart) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    const newcart = new CartSchema({
      user_id: decoded.id,
      product_id: req.body.product_id,
      quantity: req.body.quantity,
      seller_id: cart.product_id.seller_id
    });

    await newcart.save();
    return res.status(201).json({ message: "Cart created successfully", status: "success" });
  }
  catch (error) {
    return res.status(201).json({
      message: error.message,
      status: "success"
    });
  }
});

//Get my cart
router.get("/my", getAuthUser, async (req, res) => {
  try {
    const user = req.user
    let cart;

    if (user.role === "admin") {
      cart = await CartSchema.find({ seller_id: decoded._id }).populate([{ path: "product_id" }]);
    }
    else if (user.role === "seller") {
      cart = await CartSchema.find({ seller_id: decoded._id }).populate([{ path: "product_id" }]);
    }
    else {
      cart = await CartSchema.find({ user_id: decoded._id }).populate([{ path: "product_id" }]);
    }


    return res.status(200).json(cart);
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
router.delete("/clear-all",getAuthUser, async (req, res) => {
  try {
    if(user.role !== "user"){
      return res.status(401).json({ message: "Unauthorized" });
    }

    const carts = await CartSchema.find({ user_id: user._id });
    for (let i = 0; i < carts.length; i++) {
      await CartSchema.findByIdAndDelete(carts[i]._id);
    }
    return res.status(200).json({ message: "Cart deleted successfully", status: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: "error" });
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
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router