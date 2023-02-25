const express = require("express");
const router = express.Router();
const OrdersSchema = require("./../models/orders_schema");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart_schema");
const { getAuthUser } = require("../config/authuser");

router.get("/all", async (req, res) => {
  try {
    const all = await OrdersSchema.find();
    res.json({ all });
  } catch (error) {
    res.status(400).json({ message: error, status: "rrror" });
  }
});


//Get all order_detail
router.get("/my", getAuthUser, async (req, res) => {
  try {
    const user = req.user;
    let order;

    if (user.role === "admin") {
      order = await OrdersSchema.find().populate([
        {
          path: "products.product_id",
        },
      ]).sort({
        createdAt: -1
      });
    }
    else if (user.role === "seller") {
      order = await OrdersSchema.find({ seller_id: user._id }).populate([
        {
          path: "products.product_id",
        },
      ]).sort({
        createdAt: -1
      });
    }
    else {
      order = await OrdersSchema.find({ user_id: user._id }).populate([
        {
          path: "products.product_id",
        },
      ]).sort({
        createdAt: -1
      });
    }

    return res.status(200).json({all: order});
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});


//post a order_detail
router.post("/", getAuthUser, async (req, res) => {
  //Check user have token or not
  const user = req.user;

  const all_cart = await Cart.find({
    user_id: user._id
  }).populate([
    {
      path: "product_id",
    }
  ])

  if (all_cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty", status: "error" });
  }

  let products = [];
  let total = 0;
  all_cart.forEach((cart) => {
    let pp = Number(cart.product_id.price);
    let qty = Number(cart.quantity)
    total += (pp * qty);

    let obj = {};
    obj.product_id = cart.product_id._id;
    obj.quantity = cart.quantity;
    products.push(obj);
  })

  // console.log("Hello");
  console.log(products);

  try {
    const order = new OrdersSchema({
      user_id: decoded._id,
      address_id: req.body.address_id,
      seller_id: all_cart[0].product_id.seller_id,
      products: products,
      amount: total,
      status: "active",
      payment_method: req.body.payment_method,
    });
    await order.save();

    await Cart.deleteMany({ user_id: user._id });

    return res
      .status(201)
      .json({ message: "Order created successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//code to get a order by id
router.get("/:id", async (req, res) => {
  try {
    const order = await OrdersSchema.findById(req.params.id)
      .populate([
        {
          path: "products.product_id",
        }
      ])
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// code to update status of order by id
router.put("/updatestatus/:id", async (req, res) => {
  try {
    const order = await OrdersSchema.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res
      .status(200)
      .json({ message: "Order updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Delete One order_detail
router.delete("/:id", async (req, res) => {
  try {
    const order = await OrdersSchema.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Order deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});
module.exports = router;
