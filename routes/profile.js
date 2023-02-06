const express = require("express");
const router = express.Router();
const UsersSchema = require("./../models/users_schema");
const JWT = require("jsonwebtoken");
const upload = require('../config/image_upload')
require("dotenv").config();


// code to get user profile
router.get("/", async (req, res) => {
  let token = req.cookies.token || req.headers["token"] || req.headers["x-auth-token"];
  try {
    if (!token) {
      return res.status(400).json({ message: "Please provide a token.", status: "warning" })
    }
    const have_valid_token = JWT.verify(token, process.env.JWT_SECRET);
    if (!have_valid_token) {
      return res.status(400).json({
        message: "Anauthorized",
        status: "warning"
      })
    }
    const id_from_token = have_valid_token.id;

    const user_data = await UsersSchema.findById(id_from_token);

    return res.json({
      message: "Profile found",
      status: "success",
      data: user_data,
      // token: token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message, status: "error3" });
  }
});

// code to get user profile
router.patch("/", async (req, res) => {
  let token = req.cookies.token || req.headers["token"] || req.headers["x-auth-token"];
  try {
    if (!token) {
      return res.status(400).json({ message: "Please provide a token.", status: "warning" })
    }
    const have_valid_token = JWT.verify(token, process.env.JWT_SECRET);
    if (!have_valid_token) {
      return res.status(400).json({
        message: "Anauthorized",
        status: "warning"
      })
    }
    const id_from_token = have_valid_token.id;

    const user_data = await UsersSchema.findByIdAndUpdate(id_from_token, {
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
router.get("/check", async (req, res) => {
  try {
    let token = req.cookies.token || req.headers["token"];

    if (token != undefined || token != null || token != "") {
      const have_valid_token = JWT.verify(token, process.env.JWT_SECRET);
      const id_from_token = have_valid_token.id;

      const user_data = await UsersSchema.findById(id_from_token);
      res.json({
        message: "You are login & you have token",
        status: "success",
        // data: user_data,
        token: token,
      });
    } else {
      res.json({ message: "You are not login , ", status: "warning" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// route to upload profile image

router.post("/image", upload.single('image'), async (req, res) => {
  try {
    let url = req.protocol + "://" + req.get("host") + "/" + req.file.filename;

    res.json({
      message: "Image uploaded",
      status: "success",
      data: url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});




module.exports = router;
