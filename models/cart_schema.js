const mongoose = require("mongoose");
const CartSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  product_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "products"
  },
  seller_id: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },
  quantity: {
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
});
module.exports = mongoose.model("cart", CartSchema);
