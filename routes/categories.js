const express = require("express");
const upload = require("../config/image_upload");
const router = express.Router();
const CategoriesSchema = require("./../models/categories_schema");
//Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await CategoriesSchema.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one category
router.get("/:id", async (req, res) => {
  try {
    const category = await CategoriesSchema.findById(req.params.id).lean();
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// route to post category with image upload
router.post("/", upload.single("image"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(req.body);
  try {
    const url = req.protocol + "://" + req.get("host");
    const category = new CategoriesSchema({
      name: req.body.name,
      description: req.body.description,
      image: url + "/" + req.file.filename,
    });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});
//Update One
router.patch("/:id", async (req, res) => {
  try {
    const category = await CategoriesSchema.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }

    category.name = req.body.name;
    category.description = req.body.description;
    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete One
router.delete("/:id", async (req, res) => {
  try {
    const category = await CategoriesSchema.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }
    await category.remove();
    res
      .status(200)
      .json({ message: "Category deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
