const express = require("express");
const router = express.Router();
const UsersSchema = require("./../models/users_schema");

router.get("/", async (req, res) => {
  //Get all users
  try {
    const get_all_users = await UsersSchema.find().lean();
    res.status(200).json(get_all_users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// code to get user by id
router.get("/:id", async (req, res) => {
  try {
    const get_user_by_id = await UsersSchema.findById(req.params.id).lean();
    res.status(200).json(get_user_by_id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
