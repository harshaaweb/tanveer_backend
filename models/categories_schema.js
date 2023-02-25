const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
});
module.exports = mongoose.model("categories", CategoriesSchema);
