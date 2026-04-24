const express = require("express");
const router = express.Router();
const crypto = require("crypto"); 

const { PinataSDK } = require("pinata-web3");
const pinata = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });

router.post("/orders/initiate", async (req, res) => {
    try {
        const { totalPrice, userId, items, wallet_address } = req.body;
        const Order = req.app.locals.Order;

        const orderIdHex = crypto.randomBytes(4).toString("hex");

        const newOrder = new Order({ 
            orderId: orderIdHex, // Set the generated ID here
            customerId: userId,
            items: items,
            totalPrice: totalPrice,
            wallet_address: wallet_address,
            status: "pending"
        });

        const ipfsMetadata = {
            orderId: orderIdHex,
            wallet_address: wallet_address,
            items: items,
            totalPrice: totalPrice,
            timestamp: new Date().toISOString()
        };

        // 2. Upload to Pinata
        const upload = await pinata.upload.json(ipfsMetadata);
        const cid = upload.IpfsHash;

        if (!cid) {
            throw new Error("Pinata did not return an IpfsHash.");
        }

        newOrder.ipfsHash = cid;

        // 3. Save to MongoDB
        const savedOrder = await newOrder.save();
        
        console.log("Order initiated with hex ID:", orderIdHex);
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




// DELETE: Remove an order (useful for rejected or canceled payments)
router.delete("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const Order = req.app.locals.Order;

        const orderToDelete = await Order.findOne({ orderId: orderId });

        if (!orderToDelete) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (orderToDelete.ipfsHash) {
            try {
                await pinata.unpin([orderToDelete.ipfsHash]);
                console.log(`Unpinned from Pinata: ${orderToDelete.ipfsHash}`);
            } catch (pinataErr) {
                console.error("Pinata Unpin Error (ignored):", pinataErr.message);
            }
        }

        await Order.findOneAndDelete({ orderId: orderId });

        console.log(`Order ${orderId} deleted from database.`);
        res.status(200).json({ message: "Order and IPFS data cleaned up", orderId });

    } catch (err) {
        console.error("Full Cleanup Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


module.exports = router;