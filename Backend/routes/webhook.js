const express = require("express");
const router = express.Router();
const ethers = require("ethers");
// const Product = require('../models/food-products');
const Order = require('../models/food-order');
const verifyAlchemy = require("../middleware/verifyAlchemy");

router.post("/webhook", verifyAlchemy, async (req, res) => {
  try {
    const logs = req.body.event?.data?.block?.logs;

    if (!logs || logs.length === 0) {
      console.log("No logs found. This might be a test ping.");
      return res.status(200).json({ status: "ignored" });
    }

    const transactionHash = logs[0].transaction?.hash;
    const iface = new ethers.Interface([
       "event OrderPlaced(string orderId, address buyer, uint256 amount)"
    ]);

    let decoded = null;

    try {
      decoded = iface.parseLog(logs[0]);
    } catch (parseError) {
      console.log("DECODE FAILED. The ABI does not match the transaction log.");
      console.log("Log Topics:", logs[0].topics);
      console.log("Log Data:", logs[0].data);
      return res.status(200).json({ status: "error", message: "ABI Mismatch" });
    }

    if (!decoded) {
        return res.status(200).json({ status: "error", message: "Decoded as null" });
    }

    const orderId = decoded.args.orderId; 
    
    // const Order = req.app.locals.Order;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { 
        status: "paid", 
        transactionHash: transactionHash,
      },
      { returnDocument: 'after' }
    );

    if (!updatedOrder) {
      console.log("Order ID not found in DB:", orderId);
      return res.status(200).json({ message: "Order not in DB", id: orderId });
    }

    console.log("Verified Order Updated to Paid:", orderId);
    res.status(200).json({ status: "success", orderId }); 

  } catch (error) {
    console.error("Webhook Logic Error:", error.message);
    res.status(200).json({ error: error.message });
  }
});

module.exports = router;