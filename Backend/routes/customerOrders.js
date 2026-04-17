const express = require("express")
const router = express.Router()
const User = require('../models/user');



router.get("/customerOrders/single", async (req, res) => {
    try {
        const { orderId } = req.query;
        const Order = req.app.locals.Order;
        const Product = req.app.locals.Product;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findOne({ orderId: orderId }).populate({
            path: 'items.productId',
            model: Product
        });
     
        if (!order)   return res.status(404).json({ message: "Order not found in DB" });
        res.status(200).json(order);
        
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
});



router.get("/customerOrders", async (req, res) => {
    try {
        const { _id } = req.query;
        const Order = req.app.locals.Order;

        // const orders = await Order.find({ customerId:_id });
        const orders = await Order.find({ customerId: _id, status: "paid" });
        
        if (!orders) {
            return res.status(500).json({ message: "Cannot find Orders in Database" });
        }

        res.status(200).json(orders);
        

    } catch (err) {
        console.error("Finding User Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});





module.exports = router