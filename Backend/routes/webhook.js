// Import ethers to decode the blockchain data
const ethers = require("ethers");
const express = require("express")
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
       // 1. Alchemy sends the data in req.body.data
       const logs = req.body.data.block.logs;
           if (logs.length === 0) return res.status(200).send("No logs");
        const log = logs[0];

        const Order = req.app.locals.Order;

        // 2. Setup the interface to decode the OrderPlaced event
        const iface = new ethers.Interface([
          "event OrderPlaced(string orderId, address buyer, uint256 amount)"
        ]);

        // 3. Decode the data
        const decoded = iface.parseLog({
          topics: log.topics,
          data: log.data
        });

        const orderId = decoded.args.orderId;
        const txHash = log.transaction.hash;

        console.log(`Verified Order: ${orderId} | TX: ${txHash}`);

        // 4. Update MongoDB
        // This is the "Bouncer" logic that ensures the DB updates 
        // even if the user closed their tab!
        await Order.findOneAndUpdate(
          { orderId: orderId }, 
          { status: "paid", transactionHash: txHash },
           { new: true }
        );

        res.status(200).send("Webhook Handled Successfully");
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router