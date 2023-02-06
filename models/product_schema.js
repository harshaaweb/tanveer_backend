const mongoose = require("mongoose");
const ProductsSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  price: {
    type: String,
  },
  category_id: {
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
  shopId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Shop"
  }
});

module.exports = mongoose.model("products", ProductsSchema);
