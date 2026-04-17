
const express = require("express")
const router = express.Router()

router.get("/products", async (req, res)=>{
    try{
        const Product = req.app.locals.Product;

        // console.log("Is Product Model defined?", !!Product);
        console.log("Is Product Model defined?", !!Product);

        const allProducts = await Product.find()
        res.status(200).json(allProducts)
        // res.send(allProducts)
    }
    catch(err){
        console.log(err);
        res.status(500).json("Cannot Acess Data",err)
    }
})

module.exports = router