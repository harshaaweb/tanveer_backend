const express = require("express");
const { getAuthUser } = require("../config/authuser");
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

//Get all categories
router.get("/my",getAuthUser, async (req, res) => {
  try {
    const user = req.user;
    let cats = [];
    if (user.role === "seller") {
      cats = await CategoriesSchema.find({ added_by: user._id }).lean();
    } else if(user.role === "admin"){
      cats = await CategoriesSchema.find().lean();
    }else{
      cats = [];
    }
    
    return res.status(200).json(cats);
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
router.post("/", upload.single("image"),getAuthUser, async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "user") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const url = req.protocol + "://" + req.get("host");
    const category = new CategoriesSchema({
      name: req.body.name,
      description: req.body.description,
      image: url + "/" + req.file.filename,
      added_by: user._id,
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
