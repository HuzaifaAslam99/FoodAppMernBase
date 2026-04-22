const express = require("express");
const router = express.Router();

// POST: Create the initial order as "pending"
router.post("/orders", async (req, res) => {
    try {
        const { totalPrice, userId, items } = req.body;
        const Order = req.app.locals.Order;

        const newOrder = new Order({
            // orderId: 
            customerId: userId,
            items: items,
            totalPrice: totalPrice,
            status: "pending", // Default to pending until blockchain confirms
            transactionHash: null
        });

        const shortId = newOrder._id.toString().slice(-8);
        newOrder.orderId = shortId;

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);

    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});




router.get("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const Order = req.app.locals.Order;

        const findOrder = await Order.find({orderId: orderId});
        res.status(201).json(findOrder);

    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


module.exports = router;