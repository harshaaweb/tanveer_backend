const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  full_name: {
    type: String,
  },
  title: {
    type: String,
  },
  phone: {
    type: String,
  },
  dp: {
    type: String,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  dob: {
    type: String,
  },
  password: {
    type: String,
  },
  addess: {
    type: String,
  },
  role: {
    type: String,
  },
  payment_type: {
    type: String
  },
  delivery_type: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("users", UserSchema);