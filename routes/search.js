const express = require("express");
const router = express.Router();
const ProductsSchema = require("../models/product_schema");


//Create Search API
router.get("/:name", async (req, res) => {
    try {
        const search_product = await ProductsSchema.find({
            "$or": [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { about: { $regex: search, $options: "i" } },
            ],
        });
        res.json(search_product);
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});

module.exports = router;