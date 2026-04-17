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

// PATCH: Update order to "paid" after blockchain confirmation
router.put("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, transactionHash } = req.body;
        const Order = req.app.locals.Order;

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { 
                status: status, 
                transactionHash: transactionHash 
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);

    } catch (err) {
        console.error("Order Update Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;