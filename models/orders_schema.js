const mongoose = require("mongoose");
const OrdersSchema = mongoose.Schema({
  user_id: {
    type: String,
  },
  address_id: {
    type: String,
    required: true,
  },
  products: [{
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "products"
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  status: {
    type: String,
  },
  payment_method: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model("orders", OrdersSchema);