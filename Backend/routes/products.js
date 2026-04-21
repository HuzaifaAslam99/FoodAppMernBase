
const express = require("express")
const router = express.Router()

// router.get("/products", async (req, res)=>{
//     try{
//         const Product = req.app.locals.Product;

//         // console.log("Is Product Model defined?", !!Product);
//         console.log("Is Product Model defined?", !!Product);

//         // const allProducts = await Product.find()
//         const allProducts = await Product.find().maxTimeMS(5000);

//         res.status(200).json(allProducts)
//         // res.send(allProducts)
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json("Cannot Acess Data",err)
//     }
// })



router.get("/products", async (req, res) => {
    try {
        const Product = req.app.locals.Product;
        // const {category} = req.query
        const {category, min, max, sortBy} = req.query

        const minVal = min || 0;
        const maxVal = max || 9999999;

        if (minVal>maxVal){
            
        }

        let sortOptions = {};
        if (sortBy === "Low to High") sortOptions.price = 1;
        else if (sortBy === "High to Low") sortOptions.price = -1;
        else sortOptions._id = -1;
        
        if (category=="All"){
           var products = await Product.find({
                price: { 
                    $gte: minVal, 
                    $lte: maxVal
                }
           }).sort(sortOptions).maxTimeMS(5000);
        }
        else{
           var products = await Product.find(
            { category: category,
              price: { 
                $gte: minVal, 
                $lte: maxVal
              }
            }).sort(sortOptions).maxTimeMS(5000);
        }

        res.status(200).json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Cannot Access Data", error: err.message });
    }
});



module.exports = router