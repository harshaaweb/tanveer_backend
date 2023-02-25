const router = require('express').Router();
const Shop = require('../models/shop_schema')
const upload = require('../config/image_upload')
const {getAuthUser} = require("../config/authuser")
// get all shops 
router.get('/', async (req, res) => {
    try {
        const allShops = await Shop.find();
        
        return res.json({message: "Shops found", shops: allShops, status: "success"})
    } catch (error) {
        return res.json({message: error.message, status: "error"})
    }
})

// get all shops 
router.get('/my',getAuthUser,  async (req, res) => {
    try {
        const user = req.user;
        let shop = null;
        if(user.role === "admin"){
            shop = await Shop.findOne({});
        }
        else if(user.role === "seller"){
            shop = await Shop.find({
                seller_id: user._id
            });
        }else{
            shop = [];
        }
        
        return res.json({message: "Shops found", shops: shop, status: "success"})
    } catch (error) {
        return res.json({message: error.message, status: "error"})
    }
})


router.post('/',upload.single("image"), validateShop, async (req, res) => {
    try {
        const url = req.protocol + "://" + req.get("host") + "/"+req.file.filename;
        const newProduct = new Shop({
            ...req.body,
            image: url
        });
        newProduct.status = req.body.status || "unpublished";
        const savedProduct = await newProduct.save();
        return res.json({message: "Producr saved successfully", product: savedProduct, status: "success"})
    } catch (error) {
        return res.json({message: error.message, status: "error"})
    }
})

router.put('/:id', async (req, res) => {
    const {id}= req.params;
    try {
        const updateShop = await Shop.findByIdAndUpdate(id,req.body);

        if(!updateShop){
            return res.status(400).json({message: "Shop not updated", status: "error" })
        }
        return res.status(200).json({message: "Shop updated", status: "succes" })
    } catch (error) {
        return res.status(500).json({message: "Internal server error", status: "error" })
    }
});


router.delete("/:id", async (req, res) => {
    const {id} = req.body;

    try {
        const getShop = await Shop.findByIdAndDelete(id);
        return res.status(200).json({ message: "Shop deleted", status: "succes"})
    } catch (error) {
        return res.status(200).json({ message: error.message, status: "error"})
    }
})

// update shop status 

router.patch("status/:id", async (req, res) => {
    const {id} = req.params;
    const {status }=req.params;
    try {
        if(!status || status === "" || status === null || status === undefined){
            return res.status(402).json({
                message: "Please provide status",
                status: "warning"
            })
        }

        const getShop = await Shop.findByIdAndUpdate(id, status);l
        return res.json({message: "Status updated", status: "success"});
    } catch (error) {
        return res.status(500).json({message: error.message, status: "error"});
        
    }
}) 

function validateShop(req, res, next){
    const { name, address, email, phone } = req.body;
    console.log(req.body);
    if(name === "" || name === undefined || name === null){
        return res.status(400).json({ status: "error", message: "Name is required" })
    }
    if(name.length < 4) {
        return res.status(400).json({ status: "error", message: "Name is to short." })
    }
    if(email === "" || email === undefined || email === null){
        return res.status(400).json({ status: "error", message: "Email is required" })
    }
    if(address === "" || address === undefined || address === null){
        return res.status(400).json({ status: "error", message: "Address is required" })
    }
 
    if(phone === "" || phone === undefined || phone === null){
        return res.status(400).json({ status: "error", message: "Phone number is required" })
    }
    if(phone.length < 10 && phone.length > 10){
        return res.status(400).json({ status: "error", message: "Phone number is valid" })
    }

    next();
}

module.exports = router;