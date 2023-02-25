const express = require("express");
const router = express.Router();
const AddressSchema = require("./../models/address_schema");
const jwt = require("jsonwebtoken");
const { getAuthUser } = require("../config/authuser");
require("dotenv").config();

//Get all address
router.get("/", async (req, res) => {
    try {
        const address = await AddressSchema.find().lean();
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get my address
router.get("/my",getAuthUser, async (req, res) => {
    try {
        const user = req.user;
        const address = await AddressSchema.find({ user_id: user._id }).lean();
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Create address
router.post("/",getAuthUser, async (req, res) => {
    const user = req.user;

    try {
        const address = new AddressSchema({
            user_id: user._id,
            label: req.body.label,
            address_line_1: req.body.address_line_1,
            address_line_2: req.body.address_line_2,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode,
        });
        await address.save();
        res.status(201).json({ message: "Address created successfully", status: "success" });
    }
    catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});



module.exports = router;