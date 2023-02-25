const express = require("express");
const router = express.Router();
const UsersSchema = require("./../models/users_schema");
const JWT = require("jsonwebtoken");
const upload = require('../config/image_upload');
const { getAuthUser } = require("../config/authuser");
require("dotenv").config();


// code to get user profile
router.get("/", getAuthUser, async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      message: "Profile found",
      status: "success",
      data: user,
      // token: token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message, status: "error3" });
  }
});

// code to get user profile
router.patch("/", getAuthUser, async (req, res) => {
  try {
    const user = req.user;

    const user_data = await UsersSchema.findByIdAndUpdate(user._id, {
      ...req.body
    });

    return res.json({
      message: "Profile updated.",
      status: "success",
      data: user_data,
    });

  } catch (error) {
    res.status(500).json({ message: error.message, status: "error3" });
  }
});

// route to check user is login or not
router.get("/check",getAuthUser, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      message: "You are login & you have token",
      status: "success",
      data: user,
    })

  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// route to upload profile image

router.post("/image", upload.single('image'), async (req, res) => {
  try {
    let url = req.protocol + "://" + req.get("host") + "/" + req.file.filename;

    res.status(200).json({
      message: "Image uploaded",
      status: "success",
      data: url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});




module.exports = router;
