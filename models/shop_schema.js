const {Schema, model} = require("mongoose");

const shopSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String, 
        required: true,
        default: "unpublished"
    },
    registeredAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
    
}, {
    timestamps: true,
})


const Shop = model("Shop", shopSchema)

module.exports = Shop;