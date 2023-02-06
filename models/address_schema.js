
const mongoose = require("mongoose");
const AddressSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    address_line_1: {
        type: String,
        required: true,
    },
    address_line_2: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
}, { timestamps: true });
module.exports = mongoose.model("address", AddressSchema);