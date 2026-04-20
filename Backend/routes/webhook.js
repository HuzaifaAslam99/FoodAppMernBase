// Import ethers to decode the blockchain data
const ethers = require("ethers");
const express = require("express")
const crypto = require("crypto");
const router = express.Router()
const User = require('../models/user');


router.post("/webhook", async (req, res) => {

    const signature = req.headers["x-alchemy-signature"];
    const signingKey = process.env.ALCHEMY_SIGNING_KEY;

    // 1. Validate that the request actually came from Alchemy
    const hmac = crypto.createHmac("sha256", signingKey);
    const digest = hmac.update(JSON.stringify(req.body)).digest("hex");

    if (signature !== digest) {
        console.error("Invalid signature! Potential malicious request.");
        return res.status(401).send("Unauthorized");
    }

    // 2. Safety check for Test Pings
    if (!req.body.data || !req.body.data.block) {
        return res.status(200).send("Signature Validated: Test Successful");
    }

    try {
        console.log("--- Webhook Execution Started ---");

        // CHECK 1: Log extraction
        const logs = req.body.data.block.logs;
        console.log(`Logs received count: ${logs ? logs.length : 'UNDEFINED'}`);
        
        if (!logs || logs.length === 0) {
            console.log("No logs found in this block. Ending.");
            return res.status(200).send("No logs");
        }

        const log = logs[0];
        console.log("Processing Log Metadata:", JSON.stringify({
            txHash: log.transaction?.hash,
            address: log.address,
            index: log.index
        }));

        // CHECK 2: Model Availability
        const Order = req.app.locals.Order;
        if (!Order) {
            console.error("CRITICAL ERROR: Order model is undefined in req.app.locals!");
            throw new Error("Order Model Configuration Error");
        }
        console.log("Order Model check: OK");

        // CHECK 3: Interface & Decoding
        const iface = new ethers.Interface([
          "event OrderPlaced(string orderId, address buyer, uint256 amount)"
        ]);

        let decoded;
        try {
            decoded = iface.parseLog({
                topics: log.topics,
                data: log.data
            });
            console.log("Decoding successful. Decoded Args:", JSON.stringify(decoded.args));
        } catch (decodeError) {
            console.error("Decoding FAILED. Topics/Data might not match ABI:", decodeError.message);
            throw decodeError;
        }

        const orderId = decoded.args.orderId;
        const txHash = log.transaction.hash;

        console.log(`Extracted OrderID: [${orderId}] | Length: ${orderId.length}`);

        // CHECK 4: MongoDB Update Verification
        // Note: Using { _id: orderId } if orderId is the MongoDB hex string
        console.log(`Searching DB for Order with filter: { _id: "${orderId}" }`);

        const result = await Order.findOneAndUpdate(
          { _id: orderId }, // CRITICAL: Check if your DB uses _id or orderId field
          { 
            $set: { 
                status: "paid", 
                transactionHash: txHash 
            } 
          },
          { new: true, runValidators: true }
        );

        if (!result) {
            console.error(`DATABASE UPDATE FAILED: No document found matching ID [${orderId}]. 
            Check if the Order was actually created in the DB before payment.`);
            return res.status(404).send("Order ID not found in database");
        }

        console.log("DATABASE UPDATE SUCCESS: New Status:", result.status);
        console.log("--- Webhook Execution Finished Successfully ---");

        res.status(200).send("Webhook Handled Successfully");

    } catch (error) {
        console.error("--- WEBHOOK CRASH TRACE ---");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Stack Trace:", error.stack);
        res.status(500).send(`Internal Error: ${error.message}`);
    }

});

module.exports = router