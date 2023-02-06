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


module.exports = router;