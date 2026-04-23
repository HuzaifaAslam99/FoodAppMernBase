const express = require("express");
const router = express.Router();

const { PinataSDK } = require("pinata-web3");
const pinata = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });

// POST: Create the initial order as "pending"
router.post("/orders", async (req, res) => {
    try {
        const { totalPrice, userId, items, wallet_address } = req.body;
        const Order = req.app.locals.Order;

        const newOrder = new Order({
            // orderId: 
            customerId: userId,
            items: items,
            totalPrice: totalPrice,
            wallet_address: wallet_address
            // status: "pending", // Default to pending until blockchain confirms
            // transactionHash: null
        });

        const ipfsMetadata = {
            wallet_address: wallet_address,
            items: items,
            totalPrice: totalPrice,
            timestamp: new Date().toISOString()
        };

        const upload = await pinata.upload.json(ipfsMetadata);
        const cid = upload.IpfsHash;
        // const cid = upload.cid;

        if (!cid) {
            throw new Error("Pinata did not return an IpfsHash. Check your JWT permissions.");
        }

        newOrder.ipfsHash = cid;

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

        const findOrder = await Order.findOne({orderId: orderId});
        res.status(200).json(findOrder);

    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


module.exports = router;