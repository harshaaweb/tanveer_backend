const express = require("express");
const router = express.Router();
const UsersSchema = require("./../models/users_schema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

// code to logout and clear cookie and token from header 
router.get("/", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout Successfully", status: "success" });
    }
);

module.exports = router;