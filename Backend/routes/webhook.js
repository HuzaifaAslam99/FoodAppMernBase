// Import ethers to decode the blockchain data
const ethers = require("ethers");
const express = require("express")
const crypto = require("crypto");
const router = express.Router()
const User = require('../models/user');


router.post("/webhook", async (req, res) => {
    const signature = req.headers["x-alchemy-signature"];
    const signingKey = process.env.ALCHEMY_SIGNING_KEY;

    // 1. Signature Validation
    const hmac = crypto.createHmac("sha256", signingKey);
    const digest = hmac.update(JSON.stringify(req.body)).digest("hex");

    if (signature !== digest) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid signature! Potential malicious request.",
            received: signature,
            expected: digest
        });
    }

    // 2. Data Structure Check
    if (!req.body.data || !req.body.data.block) {
        return res.status(200).json({
            status: "success",
            message: "Test Ping Received",
            receivedData: !!req.body.data
        });
    }

    try {
        const logs = req.body.data.block.logs;
        if (!logs || logs.length === 0) {
            return res.status(200).json({ status: "no_action", message: "No logs in block" });
        }

        const log = logs[0];
        const Order = req.app.locals.Order;

        // Check if Order model exists
        if (!Order) {
            return res.status(500).json({
                error: "ModelError",
                message: "Order model not found in app.locals"
            });
        }

        // 3. Decoding Check
        const iface = new ethers.Interface([
            "event OrderPlaced(string orderId, address buyer, uint256 amount)"
        ]);

        const decoded = iface.parseLog({
            topics: log.topics,
            data: log.data
        });

        const orderId = decoded.args.orderId;
        const txHash = log.transaction.hash;

        // 4. Database Update Check
        // Using { _id: orderId } because your frontend likely passes the Mongo ID
        const result = await Order.findOneAndUpdate(
            { _id: orderId }, 
            { status: "paid", transactionHash: txHash },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                error: "DatabaseError",
                message: "Order not found in MongoDB",
                attemptedId: orderId,
                txHash: txHash
            });
        }

        // SUCCESS RESPONSE
        return res.status(200).json({
            status: "success",
            message: "Order updated successfully",
            data: {
                orderId: result._id,
                newStatus: result.status,
                transaction: txHash
            }
        });

    } catch (error) {
        // ERROR RESPONSE IN JSON
        return res.status(500).json({
            error: "InternalServerError",
            message: error.message,
            stack: error.stack, // Helpful for finding the exact line number
            fullLogData: req.body.data.block.logs[0] // See exactly what the log looked like
        });
    }
});


module.exports = router