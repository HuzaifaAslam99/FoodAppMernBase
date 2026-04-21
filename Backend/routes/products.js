
const express = require("express")
const router = express.Router()

router.get("/products", async (req, res) => {
    try {
        const {category, min, max, sortBy} = req.query

        const Product = req.app.locals.Product;

        const minVal = min || 0;
        const maxVal = max || 9999999;

        let sortOptions = {};
        if (sortBy === "Low to High") sortOptions.price = 1;
        else if (sortBy === "High to Low") sortOptions.price = -1;
        else sortOptions._id = -1;

        let products;
        
        if (category=="All"){
            products = await Product.find({
                price: { 
                    $gte: minVal, 
                    $lte: maxVal
                }
            }).sort(sortOptions).maxTimeMS(5000);
        }
        else{
            products = await Product.find(
                {   category: category,
                    price: { 
                        $gte: minVal, 
                        $lte: maxVal
                    }
                }
            ).sort(sortOptions).maxTimeMS(5000);
        }

        res.status(200).json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Cannot Access Data", error: err.message });
    }
});



module.exports = router