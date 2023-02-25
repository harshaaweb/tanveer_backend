const express = require("express");
const router = express.Router();
const UsersSchema = require("./../models/users_schema");
const bcrypt = require("bcryptjs");
const Shop = require("../models/shop_schema");

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

router.post("/", validateRegister, async (req, res) => {
  //Hash password
  const hashed_password = await bcrypt.hash(req.body.password, 10);

  //generate random username
  const random_username = Math.random().toString(36).substring(7);
  

  //Save user to database
  const save_user = new UsersSchema({
    full_name: req.body.full_name,
    dp: req.body?.dp || "https://styles.redditmedia.com/t5_2c83sr/styles/profileIcon_4dwzf4syg0w51.png",
    title: "I am new here :)",
    phone: "",
    email: req.body.email,
    username: req.body.username || random_username,
    password: hashed_password,
    dob: "01/01/2000",
    role: req.body.role || "user",
    address: req.body.address || "Not provided",
  });

  let shop = {};
  if(req.body.role === "seller"){
    shop = new Shop({
      name: req.body.shop_name,
      email: req.body.shop_email,
      phone: req.body.shop_phone,
      address: req.body.shop_address,
      description: req.body.shop_description,
      image: req.body.shop_image || "",
      seller_id: save_user._id,
    });
    await shop.save();
  }


  try {
    await save_user.save();
    res.status(200).json({
      message: "User created successfully",
      user: save_user,
      shop: shop,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

//Middleware for register validation
async function validateRegister(req, res, next) {
  const { full_name, email, password } = req.body;

  //Check if all fields are filled
  if (
    full_name === "" ||
    email === "" ||
    password === "" ||
    full_name === undefined ||
    email === undefined ||
    password === undefined ||
    full_name === null ||
    email === null ||
    password === null
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", status: "error" });
  }

  //Check password length
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
      status: "error",
    });
  }

  //Check if user exists
  const user = await UsersSchema.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      message: "Email already exists",
      status: "error",
    });

  //Check email is valid
  const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email_regex.test(email))
    return res.status(400).json({
      message: "Email is not valid",
      status: "error",
    });

  //Check phone is valid
  // const phone_regex = /^[0-9]{10}$/;
  // if (!phone_regex.test(phone))
  //   return res.status(400).json({
  //     message: "Phone is not valid",
  //     status: "error",
  //   });

  //Check phone is unique
  // const phone_exists = await UsersSchema.findOne({ phone: phone });
  // if (phone_exists)
  //   return res.status(400).json({
  //     message: "Phone is already exists",
  //     status: "error",
  //   });

  next();
}

module.exports = router;
